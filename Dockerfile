# Use an official Node.js runtime as the base image
FROM node:18

# Create and set the working directory in the container
WORKDIR /app

# Copy only the necessary files for package installation
COPY package.json .
COPY package-lock.json .

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build your React.js application
RUN npm run build

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
