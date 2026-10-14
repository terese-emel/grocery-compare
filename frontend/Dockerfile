FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Keep build tooling on the latest security-patched Alpine packages.
RUN apk upgrade --no-cache

COPY . .
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.29-alpine

# Apply the latest security fixes to the runtime image before copying assets.
RUN apk upgrade --no-cache

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
