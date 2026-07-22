FROM node:22-bookworm

# Install git
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build only the worker and its dependencies
RUN pnpm turbo run build --filter=worker

WORKDIR /app/apps/worker

CMD ["pnpm", "start"]