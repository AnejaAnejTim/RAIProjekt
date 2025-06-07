#!/bin/bash
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

cd backend
npm run dev &
BACKEND_PID=$!
cd ..

trap "kill -TERM -$FRONTEND_PID -$BACKEND_PID 2>/dev/null" EXIT

echo "Press 'q' to quit both frontend and backend..."
while true; do
    read -rsn1 input
    if [[ $input == "q" ]]; then
        echo -e "\nQuitting..."
        kill -TERM -$FRONTEND_PID -$BACKEND_PID 2>/dev/null
        wait $FRONTEND_PID $BACKEND_PID 2>/dev/null
        break
    fi
done
