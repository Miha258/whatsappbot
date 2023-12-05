FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN chmod +x restart.sh

COPY . .

EXPOSE 3000

CMD ["node", "bot.js"]