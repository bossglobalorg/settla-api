# Dockerfile
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files from the api directory
COPY api/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the api code
COPY api/ .

# Build the application
RUN npm run build 

EXPOSE 3333

# Use production mode
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/src/main.js"]