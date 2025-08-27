# ./frontend/Dockerfile

# Stage 1: Install deps & run dev server
FROM node:18-alpine

WORKDIR /app

# Copy only package.json + lock first for caching
COPY package*.json ./

RUN npm install

# Copy source
COPY . .

# Expose React dev server port
EXPOSE 3000

# Run React dev server
CMD ["npm", "start"]
