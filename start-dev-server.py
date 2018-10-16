#!/usr/bin/python
import os, json
from subprocess import call, check_output

base_dir = os.path.dirname(os.path.abspath(__file__))

conf_file_location = os.path.join(base_dir, "server", "config.json")
rebuild_docker_script = os.path.join(base_dir, "mysql", "rebuild-docker.py")
dev_server_cleanup_script = os.path.join(base_dir, "dev-server-cleanup.py")
wait_for_connection_script = os.path.join(base_dir, "wait-for-connection.py")

mysql_docker_name='fundme-mysql'
mysql_password="1q2w3e4r"
mysql_docker_image="lutraman/fundmedb"
mysql_user="root"
mysql_database="fundme"
mysql_port="3306"
app_listen_port="3000"

os.chdir(base_dir)

call(rebuild_docker_script)
call(dev_server_cleanup_script)

print "bringing up " + mysql_docker_name
with open(os.devnull, 'w') as FNULL:
    call(["docker", "run", "--name", mysql_docker_name,
        "-e", "MYSQL_ROOT_PASSWORD=" + mysql_password,
        "-d", mysql_docker_image], stdout=FNULL)

container_data = json.loads(check_output(['docker', 'inspect', 'fundme-mysql']))[0]
mysql_hostname = container_data["NetworkSettings"]["Networks"]["bridge"]["IPAddress"]

print "waiting for mysql server to be ready:"
call([wait_for_connection_script, mysql_hostname, mysql_port])
print "mysql server ready"

resulted_config = {
    "mysql": {
        "host": mysql_hostname,
        "password": mysql_password,
        "user": mysql_user,
        "database": mysql_database
    },
    "listen_port": app_listen_port
}

with open(conf_file_location, "w") as f:
    json.dump(resulted_config, f, indent=2)

print "all done, configuration dumped to " + conf_file_location
