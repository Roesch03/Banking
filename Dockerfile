FROM node
WORKDIR /app
COPY ./*.js ./
COPY ./*.html ./
COPY ./*.json ./
COPY ./dev ./
RUN npm i
EXPOSE 80
CMD npm run serve
