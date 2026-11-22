#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# prefsCleaner.sh — dọn prefs.js theo user.js (bản bash cho Linux)
#
# Ý tưởng & bản gốc (batch, Windows): @claustromaniac — arkenfox/user.js (MIT)
#
# Script xoá khỏi prefs.js những dòng pref mà tên cũng xuất hiện trong user.js,
# kể cả dòng user_pref đã bị comment trong user.js. Nhờ vậy pref bạn đã bỏ
# khỏi user.js sẽ được Firefox trả về giá trị mặc định.
#
#   --profile DIR    thư mục profile (mặc định: thư mục chứa script)
#   --preview        chỉ in ra sẽ xoá gì, không ghi file
#   --all            xoá mọi pref có tên trong user.js (mặc định: chỉ pref đã comment)
#   --inactive-only  (mặc định) chỉ xoá pref đã bị comment trong user.js
#   -y, --yes        không hỏi xác nhận
#   --force          bỏ qua kiểm tra Firefox đang chạy / parent.lock
#   --keep N         giữ N bản backup gần nhất (mặc định 10; 0 = giữ tất cả)
#   -h, --help       trợ giúp
#
# Mã thoát: 0 = xong, 1 = lỗi/bị chặn, 2 = không có gì để dọn
# ═══════════════════════════════════════════════════════════════════════════
set -uo pipefail

PROFILE_DIR=""
PREVIEW=0
ALL=0
ASSUME_YES=0
FORCE=0
KEEP=10

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]:-$0}")" >/dev/null 2>&1 && pwd)"

usage() {
  sed -n '2,22p' "${BASH_SOURCE[0]:-$0}" | sed 's/^# \{0,1\}//'
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --profile)       PROFILE_DIR="${2:-}"; shift 2 ;;
    --preview|--dry-run|-n) PREVIEW=1; shift ;;
    --all|-a)        ALL=1; shift ;;
    --inactive-only) ALL=0; shift ;;
    -y|--yes)        ASSUME_YES=1; shift ;;
    --force|-f)      FORCE=1; shift ;;
    --keep)
      KEEP="${2:-10}"
      case "$KEEP" in ''|*[!0-9]*) echo "LỖI: --keep cần một số nguyên" >&2; exit 1 ;; esac
      shift 2 ;;
    -h|--help)       usage; exit 0 ;;
    -*)              echo "LỖI: tham số không hợp lệ: $1" >&2; exit 1 ;;
    *)
      if [ -z "$PROFILE_DIR" ]; then PROFILE_DIR="$1"; shift
      else echo "LỖI: tham số không hợp lệ: $1" >&2; exit 1; fi ;;
  esac
done

fail() {
  echo "" >&2
  echo "  LỖI: $1" >&2
  [ -n "${2:-}" ] && echo "       $2" >&2
  echo "" >&2
  exit 1
}

head_line() { echo ""; echo "  $1"; echo ""; }

[ -n "$PROFILE_DIR" ] || PROFILE_DIR="$SCRIPT_DIR"
[ -d "$PROFILE_DIR" ] || fail "Không tìm thấy thư mục: $PROFILE_DIR"
PROFILE_DIR="$(cd -- "$PROFILE_DIR" && pwd)"
USER_JS="$PROFILE_DIR/user.js"
PREFS_JS="$PROFILE_DIR/prefs.js"

head_line "prefsCleaner.sh — dọn prefs.js theo user.js"
echo "  Profile : $PROFILE_DIR"
if [ "$PREVIEW" -eq 1 ]; then
  echo "  Chế độ  : XEM TRƯỚC"
elif [ "$ALL" -eq 1 ]; then
  echo "  Chế độ  : TẤT CẢ pref có trong user.js"
else
  echo "  Chế độ  : chỉ pref đã comment trong user.js"
fi

[ -f "$USER_JS" ]  || fail "Không thấy user.js trong: $PROFILE_DIR"
[ -f "$PREFS_JS" ] || fail "Không thấy prefs.js trong: $PROFILE_DIR (đã mở đúng profile chưa?)"

# ---- 1. Firefox đang chạy? ----
ff_running() {
  if command -v pgrep >/dev/null 2>&1; then
    pgrep -x firefox >/dev/null 2>&1 || pgrep -x firefox-bin >/dev/null 2>&1
  else
    ps -A -o comm= 2>/dev/null | awk '$1=="firefox"||$1=="firefox-bin"{f=1} END{exit !f}'
  fi
}

if [ "$FORCE" -eq 0 ]; then
  [ -e "$PROFILE_DIR/parent.lock" ] && fail "Có file parent.lock — profile này đang được dùng." "Đóng Firefox trước (hoặc dùng --force nếu chắc đó là profile khác)."
  if ff_running; then
    fail "Firefox đang chạy." "Đóng hẳn rồi chạy lại: Firefox sẽ ghi đè prefs.js khi thoát và xoá sạch kết quả."
  fi
fi

TMPD="$(mktemp -d "${TMPDIR:-/tmp}/prefscleaner.XXXXXX")" || fail "Không tạo được thư mục tạm."
cleanup_tmp() { rm -rf -- "$TMPD"; }
trap cleanup_tmp EXIT INT TERM

NAMES="$TMPD/names"
TARGET="$TMPD/target"
REMOVED="$TMPD/removed"
KEPT="$TMPD/kept"
: > "$REMOVED"

# ---- 2. Phân loại pref trong user.js ----
# A<TAB>tên = đang bật, I<TAB>tên = đã bị comment (kể cả trong /* */)
awk '
function prefname(s,   a) {
  if (match(s, /user_pref[[:space:]]*\([[:space:]]*"[^"]*"/)) {
    a = substr(s, RSTART, RLENGTH)
    sub(/^user_pref[[:space:]]*\([[:space:]]*"/, "", a)
    sub(/"$/, "", a)
    return a
  }
  return ""
}
BEGIN { inblock = 0 }
{
  line = $0
  comment = 0
  if (inblock) {
    comment = 1
    i = index(line, "*/")
    if (i == 0) {
      n = prefname(line)
      if (n != "") print "I\t" n
      next
    }
    n = prefname(substr(line, 1, i - 1))
    if (n != "") print "I\t" n
    line = substr(line, i + 2)
    inblock = 0
    comment = 0
  }
  while (1) {
    i = index(line, "/*")
    if (i == 0) break
    j = index(substr(line, i + 2), "*/")
    if (j == 0) { line = substr(line, 1, i - 1); inblock = 1; break }
    line = substr(line, 1, i - 1) substr(line, i + j + 3)
  }
  t = line
  sub(/^[ \t]+/, "", t)
  if (substr(t, 1, 2) == "//") { comment = 1; t = substr(t, 3) }
  n = prefname(t)
  if (n != "") {
    if (comment) print "I\t" n
    else print "A\t" n
  }
}
' "$USER_JS" > "$NAMES" || fail "Không đọc được user.js"

ACTIVE_CNT=$(awk -F'\t' '$1=="A"{c++} END{print c+0}' "$NAMES")
INACTIVE_CNT=$(awk -F'\t' '$1=="I"{c++} END{print c+0}' "$NAMES")

# ---- 3. Tập pref cần xoá ----
if [ "$ALL" -eq 1 ]; then
  awk -F'\t' '{print $2}' "$NAMES" | sort -u > "$TARGET"
else
  awk -F'\t' '{ if ($1=="A") act[$2]=1; else ina[$2]=1 }
              END { for (n in ina) if (!(n in act)) print n }' "$NAMES" | sort -u > "$TARGET"
fi

echo "  user.js : $ACTIVE_CNT pref đang bật, $INACTIVE_CNT pref đã comment"
echo "  Sẽ dọn : $(awk 'END{print NR}' "$TARGET") pref"

# ---- 4. Lọc prefs.js ----
awk -v tf="$TARGET" -v rf="$REMOVED" '
function prefname(s,   a) {
  if (match(s, /^[ \t]*user_pref[[:space:]]*\([[:space:]]*"[^"]*"/)) {
    a = substr(s, RSTART, RLENGTH)
    sub(/^[ \t]*user_pref[[:space:]]*\([[:space:]]*"/, "", a)
    sub(/"$/, "", a)
    return a
  }
  return ""
}
BEGIN { while ((getline x < tf) > 0) del[x] = 1; close(tf) }
{
  n = prefname($0)
  if (n != "" && (n in del)) print $0 > rf
  else print
}
' "$PREFS_JS" > "$KEPT" || fail "Không đọc được prefs.js"

OLD_CNT=$(grep -c '' "$PREFS_JS" || true)
NEW_CNT=$(grep -c '' "$KEPT" || true)
REM_CNT=$(grep -c '' "$REMOVED" || true)
: "${OLD_CNT:=0}"; : "${NEW_CNT:=0}"; : "${REM_CNT:=0}"

echo "  prefs.js: $OLD_CNT dòng trước, $NEW_CNT dòng sau, xoá $REM_CNT dòng"

if [ "$REM_CNT" -eq 0 ]; then
  echo ""
  echo "  Không có gì để dọn. prefs.js giữ nguyên."
  echo ""
  exit 2
fi

echo ""
echo "  Các pref sẽ bị xoá khỏi prefs.js:"
awk 'NR<=40 {
  line = $0
  sub(/^[ \t]*user_pref[[:space:]]*\([[:space:]]*"/, "", line)
  name = line; sub(/".*/, "", name)
  rest = $0; sub(/^.*",[[:space:]]*/, "", rest); sub(/\);[[:space:]]*$/, "", rest)
  if (length(rest) > 70) rest = substr(rest, 1, 67) "..."
  printf "    - %s = %s\n", name, rest
}' "$REMOVED"
if [ "$REM_CNT" -gt 40 ]; then
  echo "    ... và $((REM_CNT - 40)) pref nữa"
fi
echo ""

# ---- 5. Guard: không ghi file quá nhỏ ----
if [ "$NEW_CNT" -lt 2 ]; then
  fail "Kết quả chỉ còn $NEW_CNT dòng — không ghi đè prefs.js." "prefs.js giữ nguyên. Kiểm tra user.js."
fi

if [ "$PREVIEW" -eq 1 ]; then
  head_line "XEM TRƯỚC xong — không ghi file nào."
  exit 0
fi

if [ "$ASSUME_YES" -eq 0 ] && [ ! -t 0 ]; then
  fail "Không có terminal để hỏi xác nhận." "Thêm --yes nếu bạn thực sự muốn ghi đè prefs.js, hoặc dùng --preview."
fi

if [ "$ASSUME_YES" -eq 0 ]; then
  printf "  Ghi đè prefs.js? (y/N) "
  read -r answer
  case "$answer" in
    y|Y|yes|YES|c|C) ;;
    *) echo "  Đã huỷ, không thay đổi gì."; exit 1 ;;
  esac
fi

# ---- 6. Backup ----
BACKUP_DIR="$PROFILE_DIR/backups"
mkdir -p -- "$BACKUP_DIR" || fail "Không tạo được thư mục backups."
STAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP="$BACKUP_DIR/prefs-$STAMP.js"
cp -p -- "$PREFS_JS" "$BACKUP" || fail "Không tạo được backup. Không thay đổi gì."
echo "  Backup : backups/prefs-$STAMP.js"

if [ "$KEEP" -gt 0 ]; then
  ls -1t -- "$BACKUP_DIR"/prefs-*.js 2>/dev/null \
    | tail -n +"$((KEEP + 1))" \
    | while IFS= read -r old; do rm -f -- "$old"; done
fi

# ---- 7. Ghi rồi thay thế ----
TMPF="$PROFILE_DIR/prefs.js.tmp"
cp -p -- "$PREFS_JS" "$TMPF" 2>/dev/null || : > "$TMPF"
cat -- "$KEPT" > "$TMPF" || { rm -f -- "$TMPF"; fail "Không ghi được file tạm."; }

if [ ! -s "$TMPF" ]; then
  rm -f -- "$TMPF"
  fail "File tạm rỗng — không ghi đè prefs.js."
fi

if ! mv -f -- "$TMPF" "$PREFS_JS"; then
  rm -f -- "$TMPF"
  fail "Không ghi đè được prefs.js." "Dữ liệu của bạn ở backups/prefs-$STAMP.js"
fi

head_line "Xong: đã xoá $REM_CNT dòng khỏi prefs.js."
echo "  Mở lại Firefox để user.js được áp dụng."
echo ""
exit 0
