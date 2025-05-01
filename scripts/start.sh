#!/bin/bash

# Kill existing processes on ports 8000 and 8080
kill $(lsof -t -i:8000) 2>/dev/null
kill $(lsof -t -i:8080) 2>/dev/null

# Activate virtual environment
source venv/bin/activate

# Start backend server
cd git
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Start frontend server
npm run dev &
FRONTEND_PID=$!

# Save PIDs to file
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo "Backend server started with PID: $BACKEND_PID"
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Both servers are running. Press Ctrl+C to stop."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 