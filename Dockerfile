FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Change to actual entry file
CMD ["node", "src/index.js"]

EXPOSE 5000
