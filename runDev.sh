#!/bin/bash
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

cd backend
npm run dev &
BACKEND_PID=$!
cd ..
wait $BACKEND_PID
wait $FRONTEND_PID

