@echo off
echo Setting up AI Code Commander...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is required but not installed. Please install Python first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is required but not installed. Please install Node.js first.
    exit /b 1
)

REM Create Python virtual environment if it doesn't exist
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing backend dependencies...
cd git
pip install -r requirements.txt
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env files if they don't exist
if not exist git\.env (
    echo Creating backend .env file...
    (
        echo GITHUB_CLIENT_ID=your_github_client_id
        echo GITHUB_CLIENT_SECRET=your_github_client_secret
        echo SECRET_KEY=%RANDOM%%RANDOM%%RANDOM%%RANDOM%
        echo AZURE_OPENAI_DEPLOYMENT_NAME=your_azure_openai_deployment
        echo AZURE_OPENAI_API_VERSION=your_azure_openai_api_version
        echo AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
        echo AZURE_OPENAI_API_KEY=your_azure_openai_api_key
    ) > git\.env
    echo Please update git\.env with your actual credentials
)

if not exist .env (
    echo Creating frontend .env file...
    echo VITE_API_URL=http://localhost:8000 > .env
)

echo Setup completed successfully!
echo Please update the .env files with your actual credentials before running the application. 