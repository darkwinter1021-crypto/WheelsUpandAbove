@echo off
ECHO This script will deploy your WheelsUp application to Firebase Hosting.
ECHO Please make sure you have already installed Node.js on your computer.
ECHO.
PAUSE

ECHO.
ECHO Step 1: Installing Firebase Tools...
npm install -g firebase-tools

ECHO.
ECHO Step 2: Logging into Firebase...
ECHO A browser window will open. Please log in with your Google account.
firebase login

ECHO.
ECHO Step 3: Building and Deploying the App...
ECHO This may take a few minutes.
npm run deploy

ECHO.
ECHO DEPLOYMENT COMPLETE!
ECHO.
ECHO You can view your live site at the "Hosting URL" provided above.
ECHO.
PAUSE
