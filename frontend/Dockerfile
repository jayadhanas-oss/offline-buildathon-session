# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency definitions first to leverage caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Run build
RUN npm run build

# Production stage using Nginx to serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]