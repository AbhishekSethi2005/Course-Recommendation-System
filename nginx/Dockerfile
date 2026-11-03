# Production Nginx Gateway Reverse Proxy
FROM nginx:alpine

# Remove default configuration and copy our production gateway reverse proxy configuration
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

# Healthcheck to verify proxy is listening and serving
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

