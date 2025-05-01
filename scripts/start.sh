#!/bin/bash

# Kill any existing processes on ports 8000 and 8080
echo "Stopping existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Start backend server
echo "Starting backend server..."
cd /home/xianglol/Github/aira
source venv/bin/activate
cd git
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Start frontend server
echo "Starting frontend server..."
cd /home/xianglol/Github/aira
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Both servers are running. Press Ctrl+C to stop."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 