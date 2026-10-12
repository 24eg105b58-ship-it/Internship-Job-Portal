@echo off
echo Starting Internship Portal Backend (Spring Boot)...
set "JAVA_HOME=C:\Users\dell\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.20.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "SPRING_PROFILES_ACTIVE=dev"
cd backend
"C:\Users\dell\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd" spring-boot:run
pause
