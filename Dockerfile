FROM node
WORKDIR /app
COPY ./*.js ./
COPY ./*.html ./
COPY ./*.json ./
COPY ./dev ./
RUN npm i
EXPOSE 80
# EXPOSE 8080
# RUN start-stop-daemon -S -d /app -m -p /app/api.pid -b -x $(which node) -- index.js
CMD npm run serve
