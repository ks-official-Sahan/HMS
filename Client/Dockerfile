ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json .

CMD npm install

COPY . .

EXPOSE 80

EXPOSE 8080