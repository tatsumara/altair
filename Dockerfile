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

LABEL author="tatsumara"

ARG LATEST_COMMIT="Unknown"
ARG BUILD_DATE="Unknown"

# set environment variables
ENV LATEST_COMMIT=$latestCommit
ENV BUILD_DATE=$buildDate
