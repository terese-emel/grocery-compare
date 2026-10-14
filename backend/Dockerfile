FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY docs ./docs

ENV NODE_ENV=production
USER node
EXPOSE 3000

CMD ["node", "src/index.js"]
