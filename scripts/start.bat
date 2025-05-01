@echo off
echo Starting AI Code Commander...

REM Start backend server
echo Starting backend server...
start "Backend Server" cmd /c "cd git && ..\venv\Scripts\activate.bat && python main.py"

REM Start frontend server
echo Starting frontend server...
start "Frontend Server" cmd /c "npm run dev"

echo Both servers are running.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop the servers...
pause >nul

REM Kill the servers
taskkill /FI "WINDOWTITLE eq Backend Server*" /F
taskkill /FI "WINDOWTITLE eq Frontend Server*" /F 