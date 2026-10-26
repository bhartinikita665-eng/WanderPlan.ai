# Personalized Travel Itinerary Planner - Start Script
# Runs FastAPI backend on http://127.0.0.1:8000 and React Vite frontend on http://localhost:5173

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
$rootDir = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Personalized Travel Itinerary Planner" -ForegroundColor Green
Write-Host "  Full-Stack React + FastAPI + Supabase" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start FastAPI backend
Write-Host "Starting FastAPI backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
$backendJob = Start-Process python -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000" -WorkingDirectory "$rootDir\backend" -PassThru

# 2. Start Vite React frontend
Write-Host "Starting Vite React frontend on http://localhost:5173 ..." -ForegroundColor Yellow
$frontendJob = Start-Process "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$rootDir\frontend" -PassThru

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Application is live!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor DarkGray

try {
    Wait-Process -Id $frontendJob.Id, $backendJob.Id
} finally {
    Stop-Process -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -ErrorAction SilentlyContinue
}
