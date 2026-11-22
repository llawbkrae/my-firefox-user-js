<#
.SYNOPSIS
    prefsCleaner.ps1 - dọn prefs.js theo user.js (bản PowerShell, an toàn hơn batch).

.DESCRIPTION
    Xoá khỏi prefs.js những dòng pref mà tên cũng xuất hiện trong user.js
    (kể cả dòng user_pref đã bị comment trong user.js). Nhờ vậy, pref bạn đã
    comment/bỏ khỏi user.js sẽ được Firefox trả về giá trị mặc định, thay vì
    giữ mãi giá trị cũ nằm trong prefs.js.

    Khác bản batch:
      - đọc/ghi UTF-8 tường minh, giữ nguyên kiểu xuống dòng (CRLF/LF)
      - CÓ chế độ xem trước (-Preview), và hỗ trợ -WhatIf
      - mặc định CHỈ xoá pref đã comment (-InactiveOnly); -All để xoá tất cả
      - backup vào backups\prefs-<thời gian>.js, tự dọn bớt bản cũ
      - từ chối chạy khi Firefox đang chạy / có parent.lock

.PARAMETER ProfilePath
    Thư mục profile Firefox (chứa user.js và prefs.js). Mặc định: thư mục chứa script.

.PARAMETER All
    Xoá mọi pref có tên trong user.js (kể cả pref đang bật).
    Lưu ý: pref đang bật sẽ được user.js set lại khi khởi động, nhưng mọi thay
    đổi tay bạn từng làm trong about:config cho pref đó sẽ mất.

.PARAMETER InactiveOnly
    (mặc định) Chỉ xoá pref mà dòng user_pref trong user.js đã bị comment.

.PARAMETER Preview
    Chỉ in ra sẽ xoá gì, không ghi file nào.

.PARAMETER Yes
    Không hỏi xác nhận (dùng cho script/CI).

.PARAMETER Force
    Bỏ qua kiểm tra Firefox đang chạy / parent.lock. Chỉ dùng khi bạn chắc chắn.

.PARAMETER KeepBackups
    Số bản backup giữ lại trong backups\ (mặc định 10, 0 = giữ tất cả).

.EXAMPLE
    .\prefsCleaner.ps1 -Preview
    .\prefsCleaner.ps1 -Yes
    .\prefsCleaner.ps1 -ProfilePath "C:\Users\me\AppData\Roaming\Mozilla\Firefox\Profiles\xxxx.default" -All -Preview

.NOTES
    Ý tưởng & bản gốc (batch): @claustromaniac - arkenfox/user.js (MIT).
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$ProfilePath,
    [switch]$All,
    [switch]$InactiveOnly,
    [switch]$Preview,
    [switch]$Yes,
    [switch]$Force,
    [int]$KeepBackups = 10
)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch {}

function Write-Head([string]$text) { Write-Host ""; Write-Host "  $text" -ForegroundColor Cyan; Write-Host "" }
function Stop-With([string]$msg, [string]$hint) {
    Write-Host ""
    Write-Host "  LỖI: $msg" -ForegroundColor Red
    if ($hint) { Write-Host "       $hint" -ForegroundColor DarkGray }
    Write-Host ""
    exit 1
}

if ($InactiveOnly -and $All) { Stop-With "Không dùng -All và -InactiveOnly cùng lúc." }
$inactiveOnlyMode = -not $All

if (-not $ProfilePath) {
    if ($PSScriptRoot) { $ProfilePath = $PSScriptRoot } else { $ProfilePath = (Get-Location).Path }
}
if (-not (Test-Path -LiteralPath $ProfilePath)) { Stop-With "Không tìm thấy thư mục: $ProfilePath" }
$ProfilePath = (Resolve-Path -LiteralPath $ProfilePath).Path
$userJs  = Join-Path $ProfilePath 'user.js'
$prefsJs = Join-Path $ProfilePath 'prefs.js'

Write-Head "prefsCleaner.ps1 - dọn prefs.js theo user.js"
Write-Host "  Profile : $ProfilePath"
Write-Host "  Chế độ  : $(if ($Preview) {'XEM TRƯỚC'} elseif ($inactiveOnlyMode) {'chỉ pref đã comment'} else {'TẤT CẢ pref có trong user.js'})"

if (-not (Test-Path -LiteralPath $userJs))  { Stop-With "Không thấy user.js trong: $ProfilePath" }
if (-not (Test-Path -LiteralPath $prefsJs)) { Stop-With "Không thấy prefs.js trong: $ProfilePath (đã mở đúng profile chưa?)" }

# ---- 1. Firefox đang chạy? ----
if (-not $Force) {
    $ff = Get-Process -Name firefox -ErrorAction SilentlyContinue
    if ($ff) {
        Stop-With "Firefox đang chạy ($($ff.Count) tiến trình)." "Đóng hẳn Firefox rồi chạy lại. Nếu bỏ qua, Firefox sẽ ghi đè prefs.js khi thoát và xoá sạch kết quả."
    }
    if (Test-Path -LiteralPath (Join-Path $ProfilePath 'parent.lock')) {
        Stop-With "Có file parent.lock - profile này đang được dùng." "Đóng Firefox (hoặc dùng -Force nếu bạn chắc đó là profile khác)."
    }
}

# ---- 2. Đọc user.js, phân loại pref active / inactive ----
function Get-PrefName([string]$line) {
    $m = [regex]::Match($line, 'user_pref\s*\(\s*"([^"]+)"')
    if ($m.Success) { return $m.Groups[1].Value } else { return $null }
}

$activeNames   = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)
$inactiveNames = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)
$inBlock = $false

foreach ($raw in [System.IO.File]::ReadAllLines($userJs)) {
    $line = $raw
    $isComment = $false

    if ($inBlock) {
        $end = $line.IndexOf('*/')
        if ($end -lt 0) {
            # ca dong nam trong block comment: van lay ten pref, coi la inactive
            $n = Get-PrefName $line
            if ($n) { [void]$inactiveNames.Add($n) }
            continue
        }
        # phan truoc */ la comment, phan sau la code
        $n = Get-PrefName $line.Substring(0, $end)
        if ($n) { [void]$inactiveNames.Add($n) }
        $line = $line.Substring($end + 2)
        $isComment = $false
        $inBlock = $false
    }

    while ($true) {
        $open = $line.IndexOf('/*')
        if ($open -lt 0) { break }
        $close = $line.IndexOf('*/', $open + 2)
        if ($close -lt 0) { $line = $line.Substring(0, $open); $inBlock = $true; break }
        $line = $line.Substring(0, $open) + $line.Substring($close + 2)
    }

    $trim = $line.TrimStart()
    if ($trim.StartsWith('//')) { $isComment = $true; $line = $trim.Substring(2) }

    $name = Get-PrefName $line
    if (-not $name) { continue }
    if ($isComment) { [void]$inactiveNames.Add($name) } else { [void]$activeNames.Add($name) }
}

# ---- 3. Tập pref sẽ xoá ----
$target = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)
foreach ($n in $inactiveNames) { [void]$target.Add($n) }
if (-not $inactiveOnlyMode) { foreach ($n in $activeNames) { [void]$target.Add($n) } }
else { foreach ($n in $activeNames) { [void]$target.Remove($n) } }   # pref vừa active vừa comment => coi là active

Write-Host ("  user.js : {0} pref đang bật, {1} pref đã comment" -f $activeNames.Count, $inactiveNames.Count)
Write-Host ("  Sẽ dọn : {0} pref" -f $target.Count)

# ---- 4. Lọc prefs.js ----
$prefsLines = [System.IO.File]::ReadAllLines($prefsJs)
$kept    = New-Object 'System.Collections.Generic.List[string]'
$removed = New-Object 'System.Collections.Generic.List[object]'

foreach ($line in $prefsLines) {
    $m = [regex]::Match($line, '^\s*user_pref\s*\(\s*"(?<n>[^"]+)",\s*(?<v>.*)\);\s*$')
    if ($m.Success -and $target.Contains($m.Groups['n'].Value)) {
        $removed.Add([pscustomobject]@{ Pref = $m.Groups['n'].Value; Value = $m.Groups['v'].Value })
    } else {
        $kept.Add($line)
    }
}

Write-Host ("  prefs.js: {0} dòng trước, {1} dòng sau, xoá {2} dòng" -f $prefsLines.Count, $kept.Count, $removed.Count)

if ($removed.Count -eq 0) {
    Write-Host ""
    Write-Host "  Không có gì để dọn. prefs.js giữ nguyên." -ForegroundColor Green
    Write-Host ""
    exit 2
}

Write-Host ""
Write-Host "  Các pref sẽ bị xoá khỏi prefs.js:" -ForegroundColor Yellow
$show = $removed | Select-Object -First 40
foreach ($r in $show) {
    $val = $r.Value
    if ($val.Length -gt 70) { $val = $val.Substring(0, 67) + '...' }
    Write-Host ("    - {0} = {1}" -f $r.Pref, $val)
}
if ($removed.Count -gt $show.Count) { Write-Host ("    ... và {0} pref nữa" -f ($removed.Count - $show.Count)) -ForegroundColor DarkGray }
Write-Host ""

# ---- 5. Guard: không ghi file rỗng / quá nhỏ ----
if ($kept.Count -lt 2) {
    Stop-With "Kết quả chỉ còn $($kept.Count) dòng - không ghi đè prefs.js." "prefs.js giữ nguyên. Hãy kiểm tra user.js."
}

if ($Preview) {
    Write-Head "XEM TRƯỚC xong - không ghi file nào."
    exit 0
}

if (-not $Yes) {
    $answer = Read-Host "  Ghi đè prefs.js? (y/N)"
    if ($answer -notmatch '^(y|yes|c|có)$') { Write-Host "  Đã huỷ, không thay đổi gì."; exit 1 }
}

# ---- 6. Backup ----
$backupDir = Join-Path $ProfilePath 'backups'
if (-not (Test-Path -LiteralPath $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backup = Join-Path $backupDir "prefs-$stamp.js"
Copy-Item -LiteralPath $prefsJs -Destination $backup
Write-Host ""
Write-Host "  Backup : backups\prefs-$stamp.js" -ForegroundColor Green

if ($KeepBackups -gt 0) {
    Get-ChildItem -LiteralPath $backupDir -Filter 'prefs-*.js' |
        Sort-Object LastWriteTime -Descending |
        Select-Object -Skip $KeepBackups |
        ForEach-Object { Remove-Item -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue }
}

# ---- 7. Ghi nguyên tử: file tạm cùng thư mục -> thay thế ----
$bytes = [System.IO.File]::ReadAllBytes($prefsJs)
$eol = if (([System.Text.Encoding]::UTF8.GetString($bytes)) -match "`r`n") { "`r`n" } else { "`n" }
$trailingNewline = ($bytes.Length -gt 0 -and $bytes[$bytes.Length - 1] -eq 10)
$newText = ($kept -join $eol) + $(if ($trailingNewline) { $eol } else { '' })

$tmp = Join-Path $ProfilePath 'prefs.js.tmp'
try {
    if ($PSCmdlet.ShouldProcess($prefsJs, "Ghi đè: xoá $($removed.Count) dòng")) {
        [System.IO.File]::WriteAllText($tmp, $newText, (New-Object System.Text.UTF8Encoding($false)))

        if (-not (Test-Path -LiteralPath $tmp) -or (Get-Item -LiteralPath $tmp).Length -eq 0) {
            throw "File tạm rỗng"
        }
        $check = [System.IO.File]::ReadAllLines($tmp)
        if ($check.Count -ne $kept.Count) { throw "Số dòng không khớp ($($check.Count) != $($kept.Count))" }

        Move-Item -LiteralPath $tmp -Destination $prefsJs -Force
    }
} catch {
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
    Write-Host ""
    Write-Host "  LỖI: không ghi được prefs.js - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "       Dữ liệu của bạn nằm ở backups\prefs-$stamp.js" -ForegroundColor DarkGray
    Write-Host ""
    exit 1
} finally {
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
}

Write-Head "Xong: đã xoá $($removed.Count) dòng khỏi prefs.js."
Write-Host "  Mở lại Firefox để user.js được áp dụng." -ForegroundColor DarkGray
Write-Host ""
exit 0
