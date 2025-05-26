#!/bin/bash
IMAGE_NAME="yummy-frontend"
CONTAINER_NAME="yummy-frontend-container"
NETWORK_NAME="yummy-network"

DOCKERFILE_PATH="./frontend/DockerfileFrontend"
CONTEXT_DIR="./frontend"

docker network create $NETWORK_NAME 2>/dev/null || true

if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  docker rm -f $CONTAINER_NAME
fi

if [ "$(docker images -q $IMAGE_NAME)" ]; then
  docker rmi -f $IMAGE_NAME
fi

docker build -t $IMAGE_NAME -f $DOCKERFILE_PATH $CONTEXT_DIR

docker run -d --name $CONTAINER_NAME --network $NETWORK_NAME -p 3000:3000 $IMAGE_NAME

echo "Frontend teče na http://localhost:3000"
