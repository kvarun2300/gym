# Base Image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose application port
EXPOSE 5000

# Environment
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
