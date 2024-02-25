#!/bin/bash

docker run \
-e VITE_API_URL=http://172.16.98.151:7070 \
-p 8080:80 \
moreillon/prisma-auto-crud-gui:latest