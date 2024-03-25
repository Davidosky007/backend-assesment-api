# Stage 1: Build the application (adjust paths if needed)
FROM node:lts-alpine AS builder
WORKDIR /app/dist  # Move to directory where compilation happens

COPY package*.json ./
RUN npm install

COPY src/ . 

RUN npm run build  # Build the TypeScript code (assuming build script exists)

# Stage 2: Create the runtime image
FROM node:lts-alpine

WORKDIR /app

# Copy only the compiled JavaScript files and dependencies
COPY --from=builder /app/dist ./
COPY package.json ./
RUN npm install

# Expose port and start the application
EXPOSE 3000
CMD [ "npm", "start" ]
