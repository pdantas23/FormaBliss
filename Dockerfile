FROM node:20-alpine

WORKDIR /app

COPY server/package.json ./package.json

RUN npm install --production

COPY server/ ./server/
COPY shared/ ./shared/

EXPOSE 3001

CMD ["node_modules/.bin/tsx", "server/index.ts"]
