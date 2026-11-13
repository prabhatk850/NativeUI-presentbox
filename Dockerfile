# syntax=docker/dockerfile:1
# The web app (Vite + react-native-web) served by nginx. One Dockerfile, three environments:
#   docker build --build-arg APP_ENV=dev|qa|main -t presentbox:<env> .
# APP_ENV is the Vite mode, so a committed .env.<env> file (if you add one) holds that environment's non-secret settings.
# The Contentful delivery token is a build secret, not a build arg. Without it the image runs on src/mocks:
#   docker build --build-arg APP_ENV=qa --secret id=contentful_token,env=CONTENTFUL_DELIVERY_TOKEN -t presentbox:qa .

# same Node/npm major that wrote package-lock.json; npm 10 (Node 22) rejects it
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG APP_ENV=main
RUN case "$APP_ENV" in dev|qa|main) ;; *) echo "APP_ENV must be dev, qa or main" >&2; exit 1 ;; esac
RUN --mount=type=secret,id=contentful_token,env=CONTENTFUL_DELIVERY_TOKEN npm run build:web -- --mode "$APP_ENV"

FROM nginx:stable-alpine
COPY --from=build /app/dist-web /usr/share/nginx/html
# every screen has its own URL path (src/app/navigation.ts), so paths that aren't files serve the app
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files $uri $uri/ /index.html; }
}
EOF
