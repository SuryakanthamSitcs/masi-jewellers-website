#!/bin/bash
echo "Restarting services..."

# Kill existing processes more thoroughly
sudo pkill -f "elite-backend" || true
sudo pkill -f "next dev" || true
sudo pkill -f "cargo run" || true
sudo pkill -f "npm run dev" || true

# Wait for cleanup
sleep 5

# Remove any stale PID files
rm -f backend/backend.pid frontend/frontend.pid 2>/dev/null || true

# Start backend service
cd backend
echo "Starting backend..."
nohup cargo run > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Start frontend service  
cd ../frontend
echo "Starting frontend..."
nohup npm run dev -- --port 3000 > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

cd ..

# Wait for services with timeout
echo "Waiting for services to start..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "Backend service is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Backend service failed to start within 30 seconds"
        exit 1
    fi
    sleep 2
done

for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "Frontend service is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Frontend service failed to start within 30 seconds"
        exit 1
    fi
    sleep 2
done

echo "Services restarted successfully!"
