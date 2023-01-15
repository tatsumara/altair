FROM node:lts-alpine

# create and set workdir
WORKDIR /usr/src/altair

# install dependencies 
COPY package.json ./
RUN npm install

# copy bot to work dir
COPY . ./

# main command
CMD ["node", "index.js"]
