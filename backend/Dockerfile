FROM node:16

WORKDIR ./app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma:push
RUN yarn build

CMD ["node", "dist/src/main.js"]

