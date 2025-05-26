#!/bin/bash
IMAGE_NAME="yummy-backend"
CONTAINER_NAME="yummy-backend-container"
NETWORK_NAME="yummy-network"

DOCKERFILE_PATH="./backend/DockerfileBackend"
CONTEXT_DIR="./backend"

docker network create $NETWORK_NAME 2>/dev/null || true

if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  docker rm -f $CONTAINER_NAME
fi

if [ "$(docker images -q $IMAGE_NAME)" ]; then
  docker rmi -f $IMAGE_NAME
fi

docker build -t $IMAGE_NAME -f $DOCKERFILE_PATH $CONTEXT_DIR

docker run -d --name $CONTAINER_NAME --network $NETWORK_NAME -p 3001:3001 --env-file ./backend/.env $IMAGE_NAME

echo "Backend teče na http://localhost:3001"
