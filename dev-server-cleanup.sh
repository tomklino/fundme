#!/bin/bash

export MYSQL_DOCKER_NAME='fundme-mysql'

docker stop $MYSQL_DOCKER_NAME 2>&1 >/dev/null &&
docker rm $MYSQL_DOCKER_NAME 2>&1 >/dev/null
