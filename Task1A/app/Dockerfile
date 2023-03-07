FROM node:18.14.0
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD [ "node", "index.js" ]
EXPOSE 3000