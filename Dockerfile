# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /

# Copy the package.json and package-lock.json files to the container
COPY * /

# Install project dependencies
# RUN npm install

RUN npm install --legacy-peer-deps

# Build your React.js application
RUN npm run build

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


