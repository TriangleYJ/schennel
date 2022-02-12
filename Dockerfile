FROM node:15-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

ENTRYPOINT ["npm", "start"]