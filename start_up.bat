@echo off
echo Starting Waste Classification ML Project...

rem Check if venv_new exists
if exist "venv_new\Scripts\activate.bat" goto VENV_EXISTS
echo [ERROR] Virtual environment (venv_new) not found!
echo Please create it and install requirements first.
pause
exit /b

:VENV_EXISTS
rem Start Backend API (Port 5000)
echo [1/3] Starting Backend API...
start "Backend API" cmd /k "call venv_new\Scripts\activate.bat && python backend/app.py"

rem Start Chatbot API (Port 5001)
echo [2/3] Starting Chatbot API...
start "Chatbot API" cmd /k "call venv_new\Scripts\activate.bat && python chatbot/chatbot_api.py"

rem Start Frontend (Vite)
echo [3/3] Starting Frontend...
if exist "frontend\package.json" (
    start "Frontend" cmd /k "cd frontend && npm run dev"
) else (
    echo [WARNING] Frontend directory or package.json not found!
)

echo.
echo All services are starting in separate windows.
echo - Backend API: http://127.0.0.1:5000
echo - Chatbot API: http://127.0.0.1:5001
echo - Frontend: Check terminal for Vite URL (usually http://localhost:5173)
echo.
echo Keep the terminal windows open to keep the services running.
pause
