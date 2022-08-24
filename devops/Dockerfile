# Use the alpine nginx image as a base
FROM nginx:alpine
# Copy the local nginx configuration folder
COPY ./devops/nginx /etc/nginx
# Set the working directory to the default nginx html directory
WORKDIR /usr/share/nginx/html
# Remove the existing web files
RUN rm -rf ./*
# Copy the files from the static next export
COPY ./out /usr/share/nginx/html