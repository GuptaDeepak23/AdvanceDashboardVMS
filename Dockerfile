# syntax=docker/dockerfile:1

## Build stage: compile the Vite React app
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests
COPY package.json ./

# Install dependencies
RUN npm install --no-audit --no-fund --no-package-lock

# Copy source and build
COPY . .
RUN npm run build

## Run stage: serve with Nginx
FROM nginx:1.27-alpine AS run

# Copy SPA-friendly Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


