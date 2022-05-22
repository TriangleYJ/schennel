FROM node:15-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
ENV TZ=Asia/Seoul
COPY . .

ENTRYPOINT ["npm", "start"]