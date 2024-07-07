# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install --pure-lockfile

# Bundle app source
COPY . .

RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN yarn run build

# Start the server using the production build
CMD [  "yarn", "run", "start:migrate:prod" ]
