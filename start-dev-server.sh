#!/bin/bash
ENVIRONMENT_VARIABLES_FILE=/tmp/fundme-env-variables

export MYSQL_DOCKER_NAME='fundme-mysql'
export MYSQL_PASSWORD="1q2w3e4r"
export MYSQL_DOCKER_IMAGE="lutraman/fundmedb"
export MYSQL_USER="root"
export MYSQL_DATABASE="fundme"
export LISTEN_PORT=3000

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$(echo $DIR/mysql/rebuild-docker.sh);
$(echo $DIR/dev-server-cleanup.sh);

docker run --name $MYSQL_DOCKER_NAME -e MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD -d $MYSQL_DOCKER_IMAGE 2>&1 >/dev/null

export MYSQL_HOSTNAME=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $MYSQL_DOCKER_NAME)

until echo "exit" | mysql --host $MYSQL_HOSTNAME --user root -p$MYSQL_PASSWORD 2>/dev/null; do
  echo "mysql is unavailable - sleeping"
  sleep 1
done

ENVIRONMENT_VARIABLES_FILE=/tmp/fundme-env-variables

cat /dev/null > /tmp/fundme-env-variables
echo "export MYSQL_HOSTNAME=$MYSQL_HOSTNAME" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key mysql:host --val $MYSQL_HOSTNAME)
echo "export MYSQL_DOCKER_NAME=$MYSQL_DOCKER_NAME" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key mysql_docker_name --val $MYSQL_DOCKER_NAME)
echo "export MYSQL_PASSWORD=$MYSQL_PASSWORD" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key mysql:password --val $MYSQL_PASSWORD)
echo "export MYSQL_DOCKER_IMAGE=$MYSQL_DOCKER_IMAGE" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key mysql_docker_image --val $MYSQL_DOCKER_IMAGE)
echo "export MYSQL_USER=$MYSQL_USER" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key mysql:user --val $MYSQL_USER)
echo "export MYSQL_DATABASE=$MYSQL_DATABASE" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key mysql:database --val $MYSQL_DATABASE)
echo "export LISTEN_PORT=$LISTEN_PORT" >> $ENVIRONMENT_VARIABLES_FILE
$(echo node $DIR/server/save-config.js --key listen-port --val $LISTEN_PORT)


echo "source $ENVIRONMENT_VARIABLES_FILE"
