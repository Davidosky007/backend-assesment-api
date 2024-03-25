FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build # Optional build step if needed

FROM node:lts-alpine

WORKDIR /app

COPY . .

# port 3000 is the default port of the app, you can change it to any other number.
EXPOSE 3000 

CMD [ "npm", "start" ]
