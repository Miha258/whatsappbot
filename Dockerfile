FROM node:18.17.1

WORKDIR /usr/src/app

# Install necessary dependencies
RUN apt-get update && apt-get install -y --no-install-recommends chromium && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the Node.js application
CMD ["node", "bot.js"]
