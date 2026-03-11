1. docker compose run --rm certbot certonly   --webroot   --webroot-path=/var/www/certbot   --email kathuriagautam2411@gmail.com   --agree-tos   --no-eff-email   -d grafana.gautamcodebuild.in   -d jenkins.gautamcodebuild.in

2. the previou config befor running above command

# =========================
# Grafana (HTTP only)
# =========================
server {
    listen 80;
    server_name grafana.gautamcodebuild.in;

    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
        try_files $uri =404;
    }

    location / {
        proxy_pass http://grafana:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto http;
    }
}

# =========================
# Jenkins (HTTP only)
# =========================
server {
    listen 80;
    server_name jenkins.gautamcodebuild.in;

    location /.well-known/acme-challenge/ {
        alias /var/www/certbot/.well-known/acme-challenge/;
        try_files $uri =404;
    }

    location / {
        proxy_pass http://jenkins:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto http;
    }
}

