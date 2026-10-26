@echo off
title WanderPlan AI - Full Stack Launcher
echo ====================================================================
echo   Personalized Travel Itinerary Planner (WanderPlan AI)
echo   Launching FastAPI Backend and React Frontend...
echo ====================================================================
echo.

:: 1. Launch FastAPI Backend in a new CMD window
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0backend"
start "WanderPlan - FastAPI Backend (Port 8000)" cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

:: 2. Launch React Frontend in a new CMD window
echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
start "WanderPlan - React Frontend (Port 5173)" cmd /k "npm.cmd run dev"

echo.
echo ====================================================================
echo   Servers are launching!
echo   - Web App UI:      http://localhost:5173
echo   - Backend API Docs: http://127.0.0.1:8000/docs
echo ====================================================================
echo.
echo You can keep this window open or close it. Keep the other two windows open while using the app.
pause
