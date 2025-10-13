@echo off
echo Removing unused Home component files...
del "src\pages\Home.tsx" 2>nul
del "src\pages\Home.css" 2>nul
echo Home component files removed successfully!
pause
