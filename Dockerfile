FROM node:16-alpine as dependencies

WORKDIR /app

COPY package.json .npmrc ./

RUN npm i

COPY . .

RUN npx prisma generate

FROM dependencies as builder

RUN npm run build

CMD npm run start
