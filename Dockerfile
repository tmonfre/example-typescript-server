FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=9090

EXPOSE 9090

CMD ["node", "dist/index.js"]