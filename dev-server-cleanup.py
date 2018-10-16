#!/usr/bin/python
from subprocess import call, check_output
import os

mysql_docker_name='fundme-mysql'

container_id = check_output(["docker", "ps", "-q", "-a", "-f", "name=" + mysql_docker_name])
if not container_id:
    print "nothing to clean..."
    exit(0)

with open(os.devnull, 'w') as FNULL:
    call(["docker", "stop", mysql_docker_name], stdout=FNULL)
    call(["docker", "rm", mysql_docker_name], stdout=FNULL)
