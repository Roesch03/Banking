FROM node
WORKDIR /app
COPY ./*.js ./
COPY ./*.json ./
RUN npm i
EXPOSE 8080
CMD node index.js
