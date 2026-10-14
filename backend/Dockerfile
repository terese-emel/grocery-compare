FROM node:22-bookworm-slim

RUN apt-get update && apt-get upgrade -y --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Apply the latest security fixes available for the Alpine base image.
RUN apk upgrade --no-cache

COPY src ./src
COPY docs ./docs

ENV NODE_ENV=production
USER node
EXPOSE 3000

CMD ["node", "src/index.js"]
