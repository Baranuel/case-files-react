# Base stage
FROM node:22-alpine

# Set working directory
WORKDIR /opt/app

# Define ARG with a default value
ARG PORT=4173
ENV PORT=$PORT

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE $PORT

# Start Vite in preview mode (serves the built app)
CMD ["sh", "-c", "pnpm serve --host --port $PORT"]