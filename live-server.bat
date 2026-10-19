@echo off
title Public School Niyazipur Live Server
echo ========================================================
echo  Launching Live Server for Public School, Niyazipur
echo  Administered by MR. Ajit Kumar Thakur
echo ========================================================
echo.
echo Starting hot-reloading server on port 5500...
start "" "http://127.0.0.1:5500"
npx live-server --port=5500 --watch=.
pause
