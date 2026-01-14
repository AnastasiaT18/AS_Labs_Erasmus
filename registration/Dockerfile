# 1. Use official Node image
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy only package files first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the app
COPY . .

# 6. Build the app for production
RUN npm run build

# ---- Production image ----
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the built app + package.json for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables via file if you want
# Make sure .env is copied if you need it
# COPY .env .env

# Expose port 3000
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
