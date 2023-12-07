FROM node:18.17.1

WORKDIR /usr/src/app

# Install necessary dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Move and link Nginx configuration file
RUN ln -s /etc/nginx/sites-available/ec2-107-23-126-108 /etc/nginx/sites-available/
RUN ls /etc/nginx/sites-available/
# Validate Nginx configuration
RUN nginx -t

# Reload Nginx (restart for simplicity)
RUN service nginx restart
RUN cat /var/log/nginx/access.log

# Copy and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the Node.js application
CMD ["node", "bot.js"]
