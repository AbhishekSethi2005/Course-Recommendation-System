# Stage 1: Build production React + Vite bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using package-lock.json for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# Copy configuration and source code
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src/ ./src/

# Build optimized production assets into /app/dist
RUN npm run build

# Stage 2: Serve production assets via lightweight Nginx Alpine
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom frontend Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck to verify the web server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
 
