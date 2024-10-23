FROM node
WORKDIR /app
COPY ./*.js ./
COPY ./*.json ./
RUN npm i
EXPOSE 3001
CMD node index.js
