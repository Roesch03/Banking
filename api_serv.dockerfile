FROM node
WORKDIR /app
COPY ./*.js ./
COPY ./*.html ./
COPY ./*.json ./
COPY ./dev ./
RUN npm i
EXPOSE 8080
CMD node index.js
