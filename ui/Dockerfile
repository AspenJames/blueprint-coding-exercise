# Pin Node version to LTS at time of development.
FROM node:14.17.0 as build

WORKDIR /app

# Install dependencies.
COPY package.json .
COPY yarn.lock .
RUN yarn install -s --prod

# Add application code.
COPY . . 

# Build the application.
RUN yarn build

# Use Nginx webserver.
FROM nginx:1.21-alpine as final

COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html
