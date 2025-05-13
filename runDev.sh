#!/bin/bash
npm start &
FRONTEND_PID=$!
cd ..

npm run dev &
BACKEND_PID=$!
cd ..
wait $BACKEND_PID
wait $FRONTEND_PID

