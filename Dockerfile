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

# Copy all application files
COPY . .

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
FROM python:3.11-slim

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV DATA_DIR=/data
ENV PORT=3000

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY API/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /data/logs /data/pg

# Make scripts executable
RUN chmod +x run.sh Timeline/db/start.sh Timeline/db/initdb.sh

# Expose port
EXPOSE $PORT

# Start the LogLine API (PostgreSQL will be external Railway service)
CMD ["python3", "-m", "uvicorn", "API.main:app", "--host", "0.0.0.0", "--port", "3000"]