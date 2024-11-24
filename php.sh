#!/bin/bash

# Container name
CONTAINER_NAME="hit-the-note-backend"

# Check if the container exists and is running
if docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME\$"; then
    echo "Container $CONTAINER_NAME is running. Executing command..."
    docker exec -it $CONTAINER_NAME /bin/bash
else
    echo "Container $CONTAINER_NAME does not exist or is not running."
fi
