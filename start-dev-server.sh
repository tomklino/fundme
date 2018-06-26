#!/bin/bash
ENVIRONMENT_VARIABLES_FILE=/tmp/fundme-env-variables

export MYSQL_DOCKER_NAME='fundme-mysql'
export MYSQL_PASSWORD="1q2w3e4r"
export MYSQL_DOCKER_IMAGE="lutraman/fundmedb"
export MYSQL_USER="root"
export MYSQL_DATABASE="fundme"
export FUNDME_HTTP_PORT=3000

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$(echo $DIR/mysql/rebuild-docker.sh);
$(echo $DIR/dev-server-cleanup.sh);

docker run --name $MYSQL_DOCKER_NAME -e MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD -d $MYSQL_DOCKER_IMAGE 2>&1 >/dev/null

export MYSQL_HOSTNAME=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $MYSQL_DOCKER_NAME)

ENVIRONMENT_VARIABLES_FILE=/tmp/fundme-env-variables

cat /dev/null > /tmp/fundme-env-variables
echo "export MYSQL_HOSTNAME=$MYSQL_HOSTNAME" >> $ENVIRONMENT_VARIABLES_FILE
echo "export MYSQL_DOCKER_NAME=$MYSQL_DOCKER_NAME" >> $ENVIRONMENT_VARIABLES_FILE
echo "export MYSQL_PASSWORD=$MYSQL_PASSWORD" >> $ENVIRONMENT_VARIABLES_FILE
echo "export MYSQL_DOCKER_IMAGE=$MYSQL_DOCKER_IMAGE" >> $ENVIRONMENT_VARIABLES_FILE
echo "export MYSQL_USER=$MYSQL_USER" >> $ENVIRONMENT_VARIABLES_FILE
echo "export MYSQL_DATABASE=$MYSQL_DATABASE" >> $ENVIRONMENT_VARIABLES_FILE
echo "export FUNDME_HTTP_PORT=$FUNDME_HTTP_PORT" >> $ENVIRONMENT_VARIABLES_FILE

echo "source $ENVIRONMENT_VARIABLES_FILE"
