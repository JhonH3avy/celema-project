# Stage 1: Build the Angular app
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the Angular app
RUN npm run build --prod

# Stage 2: Serve the Angular app using NGINX
FROM nginx:alpine

# Copy the built Angular app from Stage 1
COPY --from=build /app/dist/celema-proyect /usr/share/nginx/html

# Copy a default NGINX configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
