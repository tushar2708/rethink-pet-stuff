# ── Stage 1: Build frontend ──────────────────────────────────
FROM node:22-alpine AS frontend-build

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source and build
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html components.json ./
COPY public/ public/
COPY src/ src/
RUN npx vite build

# ── Stage 2: Build backend ──────────────────────────────────
FROM node:22-alpine AS backend-build

WORKDIR /app/backend

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Generate Prisma client
COPY backend/prisma/ prisma/
RUN npx prisma generate

# Copy backend source and build
COPY backend/tsconfig.json ./
COPY backend/src/ src/
RUN npx tsc

# ── Stage 3: Production image ───────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app/backend

# Install only production backend dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema + generated client
COPY backend/prisma/ prisma/
RUN npx prisma generate

# Copy compiled backend
COPY --from=backend-build /app/backend/dist/ dist/

# Copy built frontend into a location the backend serves
COPY --from=frontend-build /app/dist/ /app/backend/frontend/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
