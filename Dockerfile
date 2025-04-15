FROM node:alpine

COPY . /app

WORKDIR /app

COPY package*.json ./

RUN npm install

# Change to actual entry file
CMD ["node", "src/index.js"]

EXPOSE 5000
