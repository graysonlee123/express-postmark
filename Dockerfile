FROM node:22

WORKDIR /app

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
