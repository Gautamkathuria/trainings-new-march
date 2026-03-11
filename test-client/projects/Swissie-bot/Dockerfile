FROM node:18-alpine

WORKDIR /app

# Install build tools
RUN apk add --no-cache bash git build-base python3

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including dev)
RUN npm install

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start Node
CMD ["node", "dist/index.js"]
