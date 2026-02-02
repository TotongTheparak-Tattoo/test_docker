# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY . .

# Expose the port the app runs on (default 6200 as per server.js)
EXPOSE 6200

# Command to run the application
CMD [ "node", "server.js" ]
