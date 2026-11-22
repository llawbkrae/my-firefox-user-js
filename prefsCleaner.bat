@ECHO OFF & SETLOCAL DisableDelayedExpansion
TITLE prefs.js cleaner
REM ### prefs.js cleaner for Windows
REM ## author: @claustromaniac (https://github.com/arkenfox/user.js)  | MIT
REM ## version: 2.7
REM ## patched: 2026-11-22 - see CHANGELOG at the end of this file
REM
REM Usage:  prefsCleaner.bat [options] [profile_dir]
REM   -preview      show what would be removed, change nothing
REM   -unattended   no menu, no confirmation (for scripting)
REM   -force        skip the "Firefox is running" check (use with care)
REM   -h            help
REM   profile_dir   profile folder (default: folder containing this script)

SET "_pdir=%~dp0"
SET "_ua="
SET "_preview="
SET "_force="
SET "_rc=0"
SET "_toolong="
SET "_ffrun="
SET "_ffstate="
SET "_remn=0"
SET "_oldn=0"
SET "_newn=0"

:args
IF "%~1"=="" GOTO :argsdone
IF /I "%~1"=="-unattended" (SET "_ua=1" & SHIFT & GOTO :args)
IF /I "%~1"=="--unattended" (SET "_ua=1" & SHIFT & GOTO :args)
IF /I "%~1"=="-preview"    (SET "_preview=1" & SHIFT & GOTO :args)
IF /I "%~1"=="--preview"   (SET "_preview=1" & SHIFT & GOTO :args)
IF /I "%~1"=="-force"      (SET "_force=1" & SHIFT & GOTO :args)
IF /I "%~1"=="--force"     (SET "_force=1" & SHIFT & GOTO :args)
IF /I "%~1"=="-h"          GOTO :showhelp
IF /I "%~1"=="--help"      GOTO :showhelp
SET "_pdir=%~1"
SHIFT
GOTO :args
:argsdone

IF NOT EXIST "%_pdir%\" (
	CALL :message "ERROR: profile folder not found: %_pdir%"
	SET "_rc=1"
	GOTO :finish
)
CD /D "%_pdir%"

:begin
ECHO:
ECHO:
ECHO                 ########################################
ECHO                 ####  prefs.js cleaner for Windows  ####
ECHO                 ####        by claustromaniac       ####
ECHO                 ####              v2.7              ####
ECHO                 ####   patched 2026-11-22 (see EOF) ####
ECHO                 ########################################
ECHO:
CALL :message "This script should be run from your Firefox profile directory."
ECHO   It will remove any entries from prefs.js that also exist in user.js.
CALL :message "This will allow inactive preferences to be reset to their default values."
ECHO   This Firefox profile shouldn't be in use during the process.
CALL :message ""

IF DEFINED _preview CALL :message "*** PREVIEW MODE: no file will be modified ***"
IF DEFINED _ua GOTO :run
IF DEFINED _preview GOTO :run

CHOICE /C SHE /N /M "Start [S] Help [H] Exit [E]"
CLS
IF ERRORLEVEL 3 (SET "_rc=0" & GOTO :finish)
IF ERRORLEVEL 2 GOTO :showhelp

:run
IF NOT EXIST "user.js"  (CALL :message "ERROR: user.js not found in %CD%"  & SET "_rc=1" & GOTO :finish)
IF NOT EXIST "prefs.js" (CALL :message "ERROR: prefs.js not found in %CD%" & SET "_rc=1" & GOTO :finish)

REM --- guard 1: a line longer than 8191 chars breaks FOR /F ---
CALL :strlenCheck
IF DEFINED _toolong (SET "_rc=1" & GOTO :finish)

REM --- guard 2: refuse to run while Firefox is using this profile ---
IF NOT DEFINED _force CALL :FFcheck
IF DEFINED _ffrun (SET "_rc=1" & GOTO :finish)

REM --- build the cleaned copy (prefs.js is not touched here) ---
CALL :cleanup
IF NOT EXIST "tempcleanedprefs" (
	CALL :message "ERROR: could not build the cleaned copy. prefs.js left untouched."
	SET "_rc=1"
	GOTO :finish
)

FOR /F "tokens=3" %%A IN ('FIND /C /V "" "prefs.js"')         DO SET "_oldn=%%A"
FOR /F "tokens=3" %%A IN ('FIND /C /V "" "tempcleanedprefs"') DO SET "_newn=%%A"
IF EXIST "temp-removed" FOR /F "tokens=3" %%A IN ('FIND /C /V "" "temp-removed"') DO SET "_remn=%%A"
IF "%_newn%"=="" SET "_newn=0"
IF "%_oldn%"=="" SET "_oldn=0"

REM --- guard 3: never overwrite prefs.js with a suspiciously small file ---
IF %_newn% LSS 2 (
	CALL :message "ABORT: result would have only %_newn% line(s) - not overwriting prefs.js."
	CALL :message "       prefs.js left untouched. Please check user.js."
	SET "_rc=1"
	GOTO :finish
)

CALL :message "prefs.js: %_oldn% lines before, %_newn% after, removed %_remn%"
IF %_remn% GTR 0 (
	ECHO   Prefs that will be removed from prefs.js:
	FOR /F tokens^=1^,2^ delims^=^"^' %%I IN ('TYPE "temp-removed"') DO @ECHO     - %%J
	ECHO:
)

IF DEFINED _preview (
	CALL :message "PREVIEW done - nothing was written."
	SET "_rc=0"
	GOTO :finish
)

REM --- backup first, into backups\ ---
IF NOT EXIST "backups" MKDIR "backups"
SET "_ts="
FOR /F "delims=" %%# IN ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss" 2^>nul') DO SET "_ts=%%#"
IF NOT DEFINED _ts SET "_ts=%RANDOM%%RANDOM%"
COPY /B /V /Y "prefs.js" "backups\prefs-%_ts%.js" >NUL
IF ERRORLEVEL 1 (
	CALL :message "ERROR: could not create the backup. Nothing was changed."
	SET "_rc=1"
	GOTO :finish
)
CALL :message "Backup: backups\prefs-%_ts%.js"

REM --- replace prefs.js, and actually verify that it worked ---
MOVE /Y "tempcleanedprefs" "prefs.js" >NUL
IF ERRORLEVEL 1 (
	CALL :message "ERROR: could not overwrite prefs.js (locked or read-only)."
	CALL :message "       Your data is in backups\prefs-%_ts%.js"
	SET "_rc=1"
	GOTO :finish
)

CALL :message "All done. Removed %_remn% line(s) from prefs.js."
SET "_rc=0"
IF NOT DEFINED _ua IF NOT DEFINED _preview TIMEOUT 5 >NUL
GOTO :finish


REM ########## Helpers ###########
:message
ECHO:
ECHO:  %~1
ECHO:
GOTO :EOF

REM ### detect lines too long for FOR /F (FINDSTR truncates them) ###
:strlenCheck
SETLOCAL ENABLEDELAYEDEXPANSION
SET /a cnt=0
FOR /F "tokens=1,* delims=:" %%G IN ('FINDSTR /N "^" prefs.js') DO (
	SET /a cnt += 1
	IF /I "%%G" NEQ "!cnt!" (
		CALL :message "ERROR: line !cnt! of prefs.js is too long (over 8191 chars)."
		ENDLOCAL
		SET "_toolong=1"
		GOTO :EOF
	)
)
ENDLOCAL
GOTO :EOF

REM ### refuse when this profile is in use ###
:FFcheck
IF EXIST "parent.lock" (
	CALL :message "ERROR: parent.lock found - this profile is in use."
	SET "_ffrun=1"
	GOTO :EOF
)
SET "_ffstate="
FOR /F "delims=" %%# IN ('powershell -NoProfile -Command "if (Get-Process -Name firefox -ErrorAction SilentlyContinue) { 'running' } else { 'idle' }" 2^>nul') DO SET "_ffstate=%%#"
IF /I "%_ffstate%"=="running" (
	CALL :message "ERROR: firefox.exe is running."
	CALL :message "       Close Firefox completely, then run this again:"
	CALL :message "       Firefox rewrites prefs.js when it exits and would undo the cleanup."
	CALL :message "       Use -force only if you are sure this profile is not in use."
	SET "_ffrun=1"
	GOTO :EOF
)
IF NOT DEFINED _ffstate (
	REM PowerShell is unavailable - fall back to tasklist
	TASKLIST /FI "IMAGENAME eq firefox.exe" 2>NUL | FIND /I "firefox.exe" >NUL
	IF NOT ERRORLEVEL 1 (
		CALL :message "ERROR: firefox.exe is running (detected via tasklist)."
		SET "_ffrun=1"
		GOTO :EOF
	)
)
GOTO :EOF

REM ### keep every prefs.js line whose pref name is NOT managed by user.js ###
:cleanup
IF EXIST "temp-removed" DEL /F /Q "temp-removed" >NUL 2>&1
FOR /F tokens^=2^ delims^=^'^" %%G IN ('FINDSTR /R /C:"^[^\"']*user_pref[ 	]*\([ 	]*[\"'][^\"']*[\"'][ 	]*," user.js') DO (
	IF NOT ""=="%%G" SET "[%%G]=1"
)
(
	FOR /F "tokens=1,* delims=:" %%G IN ('FINDSTR /N "^" prefs.js') DO (
		IF ""=="%%H" (
			ECHO:
		) ELSE (
			FOR /F tokens^=1^,2^ delims^=^"^' %%I IN ("%%H") DO (
				IF DEFINED [%%J] (
					ECHO %%H>>"temp-removed"
				) ELSE (
					ECHO:%%H
				)
			)
		)
	)
)>"tempcleanedprefs"
GOTO :EOF

REM ############### Help ##################
:showhelp
MODE 80,40
CLS
CALL :message "prefsCleaner.bat v2.7 (patched) - options"
ECHO   -preview      show what would be removed, change nothing
ECHO   -unattended   no menu / no confirmation (for scripting)
ECHO   -force        skip the Firefox-is-running check (use with care)
ECHO   -h            this help
ECHO   profile_dir   profile folder to clean (default: script folder)
ECHO:
CALL :message "What it does"
ECHO   Removes from prefs.js every entry whose pref name also appears in
ECHO   user.js, including pref lines that are commented out in user.js.
ECHO   Commented-out prefs therefore fall back to Firefox defaults.
ECHO:
CALL :message "Safety"
ECHO   1. Refuses to run while firefox.exe is running or parent.lock exists.
ECHO   2. Builds the result in a temp file first; aborts if it looks empty.
ECHO   3. Backs up prefs.js to backups\prefs-TIMESTAMP.js before replacing.
ECHO   4. Verifies the replace actually succeeded.
ECHO:
CALL :message "If something goes wrong"
ECHO   1. Make sure Firefox is closed.
ECHO   2. Delete prefs.js in your profile folder.
ECHO   3. Delete Invalidprefs.js if you have one in the same folder.
ECHO   4. Rename or copy your latest backup to prefs.js.
ECHO   5. Run Firefox and check your UI and extensions.
ECHO   6. Still broken? about:support, then Troubleshoot Mode, then restart.
ECHO:
CALL :message "Report issues: https://github.com/arkenfox/user.js/issues"
PAUSE
CLS
GOTO :begin

REM ########## End of script ##########
:finish
IF EXIST "tempcleanedprefs" DEL /F /Q "tempcleanedprefs" >NUL 2>&1
IF EXIST "temp-removed"     DEL /F /Q "temp-removed"     >NUL 2>&1
ENDLOCAL & EXIT /B %_rc%

REM ###########################################################################
REM CHANGELOG 2026-11-22, vs upstream v2.7 by claustromaniac:
REM   1. [NEW] Refuse to run when firefox.exe is running or parent.lock exists.
REM      Upstream only warns plus PAUSE, so closing Firefox afterwards rewrites
REM      prefs.js from memory and undoes the cleanup. Detection uses PowerShell
REM      (tasklist can fail with "Access denied") and falls back to tasklist.
REM   2. [NEW] Build the result in a temp file, then abort if it has fewer than
REM      2 lines. Upstream can overwrite prefs.js with an empty file.
REM   3. [NEW] Check ERRORLEVEL after MOVE. Upstream prints "All done!" even
REM      when the overwrite failed (prefs.js read-only or locked).
REM   4. [NEW] -preview flag: print line counts and the pref list, write nothing.
REM   5. [FIX] No more EXIT (it closed the console window): every exit goes
REM      through :finish with ENDLOCAL plus EXIT /B.
REM   6. [CHG] Backups go to backups\prefs-TIMESTAMP.js. Fallback timestamp when
REM      PowerShell is blocked by policy.
REM   7. [NEW] -force to skip the running-Firefox check when you know better.
REM   8. [CHG] Optional profile folder argument.
REM   9. [FIX] Removed every bare > or < from ECHO/REM text: cmd treated them as
REM      redirections and created stray files.
REM ###########################################################################
