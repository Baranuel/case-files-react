# Base stage
FROM node:22-alpine

# Set working directory
WORKDIR /opt/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Expose port 5173 for the Vite server
EXPOSE 5173

# Start Vite in preview mode (serves the built app)
CMD ["pnpm", "serve", "--host"]