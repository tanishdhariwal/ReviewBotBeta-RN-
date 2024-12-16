FROM node:18-alpine AS build_image

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production   # this is when you want to install dependencies for production only

COPY . .

EXPOSE 5000

CMD ["npm", "start"]


