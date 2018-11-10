FROM mhart/alpine-node:11

RUN mkdir -p /opt/static-server

WORKDIR /opt/static-server

COPY static-file-server/node_modules /opt/static-server/node_modules/
COPY static-file-server/server.js /opt/static-server/server.js
COPY dist /opt/static-server/dist

ENTRYPOINT [ "node", "server" ]
