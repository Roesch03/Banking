FROM node
WORKDIR /app
COPY ./*.js ./
COPY ./*.html ./
COPY ./*.json ./
COPY ./dev ./
EXPOSE 8080
CMD node index.js
