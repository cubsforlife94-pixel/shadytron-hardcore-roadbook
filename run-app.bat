@echo off
setlocal

rem Always run from the folder that contains this batch file.
cd /d "%~dp0"

if not exist "package.json" (
  echo Could not find package.json in "%CD%".
  pause
  exit /b 1
)

set "PNPM_CMD="
for /f "delims=" %%P in ('where pnpm 2^>nul') do if not defined PNPM_CMD set "PNPM_CMD=%%P"

rem Fall back to the bundled Codex runtime when this file is launched directly.
if not defined PNPM_CMD if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd" set "PNPM_CMD=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"

rem Also check common per-user pnpm locations.
if not defined PNPM_CMD if exist "%APPDATA%\npm\pnpm.cmd" set "PNPM_CMD=%APPDATA%\npm\pnpm.cmd"
if not defined PNPM_CMD if exist "%LOCALAPPDATA%\pnpm\pnpm.exe" set "PNPM_CMD=%LOCALAPPDATA%\pnpm\pnpm.exe"

if not defined PNPM_CMD (
  echo pnpm was not found on PATH.
  echo Install Node.js and pnpm, then run this file again.
  pause
  exit /b 1
)

rem The Codex-bundled pnpm launcher keeps node next to its own folder.
for %%D in ("%PNPM_CMD%") do set "PNPM_DIR=%%~dpD"
if exist "%PNPM_DIR%..\..\node\bin\node.exe" set "PATH=%PNPM_DIR%..\..\node\bin;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found on PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

echo Starting Shadytron Hardcore Roadbook from:
echo   %CD%
echo.
call "%PNPM_CMD%" dev

if errorlevel 1 (
  echo.
  echo The application stopped with an error.
  pause
)

endlocal
