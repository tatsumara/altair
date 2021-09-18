FROM node:alpine

# create and set workdir
WORKDIR /usr/src/altair

# install dependencies 
COPY package.json ./
RUN npm install

# copy bot to work dir
COPY . ./

# main command
CMD ["node", "index.js"]

ARG LATEST_COMMIT="Unknown"
ARG BUILD_DATE="Unknown"

# set environment variables
ENV LATEST_COMMIT=$LATEST_COMMIT
ENV BUILD_DATE=$BUILD_DATE
