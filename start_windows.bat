@echo off
echo Starting Summit Media Browser...
echo Opening at http://localhost:8080
echo.
echo To stop: close this window
echo.
cd /d "%~dp0"
start "" "http://localhost:8080"
python -m http.server 8080
pause
