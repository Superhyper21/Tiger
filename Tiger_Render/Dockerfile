
# Use official Node image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy app source
COPY backend/ ./

# Expose port and run
ENV PORT=4000
EXPOSE 4000
CMD [ "node", "src/index.js" ]
