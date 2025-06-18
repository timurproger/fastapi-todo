# Сборка проекта
FROM node:20 AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Сервер для статики
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx конфиг по умолчанию подходит
EXPOSE 80
