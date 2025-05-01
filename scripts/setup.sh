#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up AI Code Commander...${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Create Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd git
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install

# Create .env files if they don't exist
if [ ! -f "git/.env" ]; then
    echo -e "${BLUE}Creating backend .env file...${NC}"
    cat > git/.env << EOL
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SECRET_KEY=$(openssl rand -hex 32)
AZURE_OPENAI_DEPLOYMENT_NAME=your_azure_openai_deployment
AZURE_OPENAI_API_VERSION=your_azure_openai_api_version
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
EOL
    echo "Please update git/.env with your actual credentials"
fi

if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating frontend .env file...${NC}"
    echo "VITE_API_URL=http://localhost:8000" > .env
fi

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "Please update the .env files with your actual credentials before running the application." 