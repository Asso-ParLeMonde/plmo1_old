# STAGE 1 - Typescript to Javascript
FROM node:12.13-alpine as build-dependencies

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY src /usr/src/app/src
COPY tsconfig.json /usr/src/app
COPY tslint.json /usr/src/app

RUN yarn build



# STAGE 2 - Docker server
FROM node:12.13-alpine as prod

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy app files
COPY src src
COPY --from=build-dependencies /usr/src/app/dist dist

EXPOSE 5000
CMD [ "node", "./dist/app.js" ]
