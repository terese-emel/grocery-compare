FROM node:22-bookworm-slim

RUN apt-get update && apt-get upgrade -y --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY docs ./docs

ENV NODE_ENV=production
USER node
EXPOSE 3000

CMD ["node", "src/index.js"]
