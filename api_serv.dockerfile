FROM node
WORKDIR /app
COPY ./index.js ./index.js
COPY ./*.json ./
RUN npm i
EXPOSE 8080
CMD node index.js
