# Use an official Python runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY sections /app/sections
COPY utils /app/utils
COPY index.js /app
COPY package.json /app
COPY dotenv /app/.env

RUN npm install 2>/dev/null
RUN npm install -g nodemon 2>/dev/null

EXPOSE 8080

ENV ROOT_PATH="/app"

ENTRYPOINT npm start
