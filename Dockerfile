FROM node:14-alpine

WORKDIR /home/node/app
ADD . /home/node/app

VOLUME /data

EXPOSE 3030
ENV NODE_ENV=production \
  DATABASE=sqlite3 \
  POSTGRES_HOST=postgres \
  POSTGRES_DATABASE=postgres \
  POSTGRES_USER=postgres \
  POSTGRES_PASSWORD=postgres \
  OPENWEATHER_APPID="" \
  OPENWEATHER_LOCATION=London

RUN npm install

CMD ['npm', 'start']
