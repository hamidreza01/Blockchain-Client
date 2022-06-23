FROM node:alpine
USER root
COPY . /NODE
WORKDIR /NODE
RUN npm install 
RUN npm link
CMD ["node", "./App/index.js"]