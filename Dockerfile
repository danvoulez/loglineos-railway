# LogLineOS Consciousness Binary Constellation - Railway Deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Copy package files first (for better caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy consciousness binary constellation
COPY bin/ ./bin/
COPY .env* ./

# Make binaries executable
RUN chmod +x bin/logline_gateway.js

# Create data directories
RUN mkdir -p /app/data /app/logs /app/data/contracts

# Expose the main port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the LogLine Gateway (Node.js)
CMD ["node", "bin/logline_gateway.js"]