FROM node:18.17.1

WORKDIR /usr/src/app

# Install necessary dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Move Nginx configuration file
COPY ec2-18-209-22-225.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/ec2-18-209-22-225.conf /etc/nginx/sites-enabled/

# Validate Nginx configuration
RUN nginx -t

# Reload Nginx (restart for simplicity)
RUN service nginx restart

# Copy and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the Node.js application
CMD ["node", "bot.js"]
