@echo off
echo Deploying AuraFlow theme to Keycloak...

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed or not running
    echo Please install Docker or use manual copy method
    pause
    exit /b 1
)

REM Find Keycloak container
for /f "tokens=1" %%i in ('docker ps --format "{{.Names}}" ^| findstr keycloak') do set KEYCLOAK_CONTAINER=%%i

if "%KEYCLOAK_CONTAINER%"=="" (
    echo No Keycloak container found running
    echo Available containers:
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
    echo.
    echo Please start your Keycloak container or use manual copy method
    pause
    exit /b 1
)

echo Found Keycloak container: %KEYCLOAK_CONTAINER%

REM Copy theme to container
echo Copying AuraFlow theme to container...
docker cp keycloak-theme\auraflow %KEYCLOAK_CONTAINER%:/opt/keycloak/themes/

if errorlevel 1 (
    echo Failed to copy theme to container
    pause
    exit /b 1
)

echo Theme copied successfully!
echo.
echo Next steps:
echo 1. Go to Keycloak Admin Console (http://localhost:8080)
echo 2. Navigate to Realm Settings ^> Themes
echo 3. Set Login Theme to "auraflow"
echo 4. Save changes
echo 5. Restart Keycloak container: docker restart %KEYCLOAK_CONTAINER%
echo.
pause
