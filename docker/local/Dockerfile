# Base stage
FROM node:22-alpine

# Set working directory
WORKDIR /opt/app

# Define ARG with a default value

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start Vite in preview mode (serves the built app)
CMD ["sh", "-c", "pnpm dev --host --port 3000"]