# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build args สำหรับ Vite env vars (ต้องส่งตอน build)
ARG VITE_DIRECTUS_TOKEN
ENV VITE_DIRECTUS_TOKEN=$VITE_DIRECTUS_TOKEN

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
