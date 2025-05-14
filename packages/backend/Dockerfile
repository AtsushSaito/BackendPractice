FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# rimrafをグローバルにインストール
RUN npm ci && npm install -g rimraf

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 