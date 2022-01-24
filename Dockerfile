FROM node:16-alpine

# RUN mkdir -p /home/node/app/node_modules
# RUN chown -R node:node /home/node/app

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# USER node

# If you are building your code for production
# RUN npm ci --only=production
COPY --chown=node:node package.json .
RUN npm install

# Copy your application code with the appropriate permissions 
# to the application directory on the container
COPY --chown=node:node . .
USER node

# expose port 5000 on the container and start the application
EXPOSE 5000
CMD [ "node", "server.js" ]