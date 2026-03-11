# Use the official lightweight Node.js 20 image
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of your app code
COPY . .

# Expose the port (Node apps commonly use 3000)
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
