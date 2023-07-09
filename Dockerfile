FROM node:18.16.0-alpine
WORKDIR /app
COPY . /app
RUN npm ci
CMD npm start
EXPOSE 3000