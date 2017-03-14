FROM node:6.9.5
RUN mkdir -p /server
WORKDIR /server
RUN npm install fastboot-app-server@1.0.0-rc.5
COPY server.js /server/
RUN mkdir -p /dist
WORKDIR /dist
ENTRYPOINT npm install && cd /server/ && export PORT=80 && node server.js
