FROM node:11
WORKDIR /app
COPY . /app
RUN npm install
CMD node server.js
EXPOSE 3000
