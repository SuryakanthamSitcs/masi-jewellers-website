#!/bin/bash
echo "Restarting services..."
sudo pkill -f elite-backend
sudo pkill -f "next dev"
sleep 3

cd /var/www/elite-website/backend
nohup cargo run > backend.log 2>&1 &

cd /var/www/elite-website/frontend  
nohup npm run dev -- --port 3000 > frontend.log 2>&1 &

sleep 5
echo "Services restarted!"
