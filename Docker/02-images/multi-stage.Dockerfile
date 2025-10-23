# Multi-stage Build Examples

# ================================
# Example 1: Node.js with Build Stage
# ================================
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

USER node

CMD ["node", "dist/server.js"]


# ================================
# Example 2: Go Multi-stage
# ================================
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

CMD ["./main"]


# ================================
# Example 3: Python with Dependencies
# ================================
FROM python:3.11 AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

RUN pip install --no-cache /wheels/*

COPY . .

CMD ["python", "app.py"]


# ================================
# Example 4: Multiple Build Stages
# ================================
FROM node:18 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run test

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]


# ================================
# Example 5: Build Arguments
# ================================
FROM node:18 AS builder

ARG NODE_ENV=production
ARG API_URL

ENV NODE_ENV=${NODE_ENV}
ENV REACT_APP_API_URL=${API_URL}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# ================================
# Example 6: Multiple FROM stages
# ================================
FROM alpine:latest AS base
RUN apk add --no-cache ca-certificates

FROM golang:1.21-alpine AS go-builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY ./backend .
RUN CGO_ENABLED=0 go build -o api

FROM node:18-alpine AS node-builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

FROM base
WORKDIR /app

COPY --from=go-builder /app/api .
COPY --from=node-builder /app/dist ./static

EXPOSE 8080

CMD ["./api"]





