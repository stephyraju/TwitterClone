
FROM node:16.14 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm rebuild node-sass
RUN npm run build

FROM httpd:alpine3.14
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /app/dist/twitter-clone/ .

