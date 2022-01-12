FROM node:10
WORKDIR /app
COPY . /app
RUN npm install rimraf -g
RUN rimraf node_modules
RUN npm install
CMD npm run start

EXPOSE 3000
