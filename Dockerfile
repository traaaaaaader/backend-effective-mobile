FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma

RUN npm run prisma:generate

COPY . ./

RUn npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY .env ./

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]
