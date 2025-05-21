@echo off
echo === Luna Debug Build Script ===
echo This script will build Luna with detailed logging to help diagnose issues.
echo.

node build-luna-debug.js

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Build failed with error code %ERRORLEVEL%
  echo Please check the logs above for details.
  pause
  exit /b %ERRORLEVEL%
) else (
  echo.
  echo Build completed successfully!
  pause
)
