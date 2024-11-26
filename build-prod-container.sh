#!/bin/bash

docker compose down

docker compose run --rm application npm install
docker compose run --rm application npm run build
docker compose run --rm backend composer install

mkdir -p dist
docker buildx create --name container --driver=docker-container
docker build -t jakub/hit-the-note:1.0.0 --output type=docker,dest=./dist/hit-the-note.tar -f Dockerfile.prod --builder=container .