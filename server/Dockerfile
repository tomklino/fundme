FROM mhart/alpine-node:11

RUN mkdir -p /opt/app
RUN mkdir -p /entrypoint.d

COPY docker-init.sh /
ENTRYPOINT [ "/docker-init.sh" ]
WORKDIR /opt/app

COPY config.defaults.json /opt/app
COPY config-loader.js /opt/app
COPY app.js /opt/app
COPY node_modules /opt/app/node_modules
COPY project_modules /opt/app/project_modules
COPY graphql /opt/app/graphql

CMD [ "node", "app" ]
