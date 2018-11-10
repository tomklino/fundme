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
frontend_listen_port="3002"
fronend_docker_name="fundme_frontend"
frontend_docker_image="fundme-frontend"
app_listen_port="3000"

os.chdir(base_dir)

call(rebuild_docker_script)
call(dev_server_cleanup_script)

print "bringing up " + mysql_docker_name
with open(os.devnull, 'w') as FNULL:
    call(["docker", "run", "--name", mysql_docker_name,
        "-e", "MYSQL_ROOT_PASSWORD=" + mysql_password,
        "-d", mysql_docker_image], stdout=FNULL)

mysql_container_data = json.loads(check_output(['docker', 'inspect', mysql_docker_name]))[0]
mysql_hostname = mysql_container_data["NetworkSettings"]["Networks"]["bridge"]["IPAddress"]

with open(os.devnull, 'w') as FNULL:
    call(["docker", "run", "--name", fronend_docker_name,
        "-e", "LISTEN_PORT=" + frontend_listen_port,
        "--expose", frontend_listen_port,
        "-d", frontend_docker_image], stdout=FNULL)

frontend_container_data = json.loads(check_output(['docker', 'inspect', fronend_docker_name]))[0]
fronend_hostname = frontend_container_data["NetworkSettings"]["Networks"]["bridge"]["IPAddress"]
frontend_static_server = fronend_hostname + ":" + frontend_listen_port

print "waiting for mysql server to be ready:"
call([wait_for_connection_script, mysql_hostname, mysql_port])
print "mysql server ready"

resulted_config = {
    "frontend_static_server": frontend_static_server,
    "mysql": {
        "host": mysql_hostname,
        "port": mysql_port,
        "password": mysql_password,
        "user": mysql_user,
        "database": mysql_database
    },
    "listen_port": app_listen_port
}

with open(conf_file_location, "w") as f:
    json.dump(resulted_config, f, indent=2)

print "all done, configuration dumped to " + conf_file_location
