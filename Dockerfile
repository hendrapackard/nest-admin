#Source image
FROM node:14.15.5-alpine3.13

#Install bash and nano
RUN apk update && apk add bash && apk add nano

# Create working directory with name app
WORKDIR /app

# Copy working to working directory
COPY package.json .

# Install dependency inside container
RUN npm install

# Copy all the other files
COPY . .

#Install nestjs globally via npm
RUN npm i -g @nestjs/cli
