@echo off
echo ========================================================
echo  Starting Internship and Job Application Portal
echo ========================================================
start "Internship Portal - Backend" cmd /c run-backend.bat
timeout /t 5 /nobreak >nul
start "Internship Portal - Frontend" cmd /c run-frontend.bat
echo Backend and Frontend have been launched in separate windows!
echo Frontend URL: http://localhost:5173
echo Backend API / Swagger UI: http://localhost:8080/swagger-ui/index.html
pause
