FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the application port
EXPOSE 3000

# Run as non-root user for security
USER node

# Start the application
CMD ["npm", "start"]
