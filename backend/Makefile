# Docker-based Laravel development commands
# All commands run inside containers to avoid touching host environment

.PHONY: up down fresh bash composer keygen migrate seed migrate-fresh-seed test pint stan queue tinker

# Container management
up:
	docker compose up -d --build

down:
	docker compose down

fresh:
	docker compose down -v
	docker compose up -d --build

bash:
	docker compose exec app bash

# Laravel commands
composer:
	docker compose exec app composer install --no-interaction --prefer-dist

keygen:
	docker compose exec app php artisan key:generate

migrate:
	docker compose exec app php artisan migrate

seed:
	docker compose exec app php artisan db:seed

migrate-fresh-seed:
	docker compose exec app php artisan migrate:fresh --seed

# Testing and quality
test:
	docker compose exec app php artisan test

pint:
	docker compose exec app ./vendor/bin/pint

stan:
	docker compose exec app ./vendor/bin/phpstan analyse --level=max

# Queue worker
queue:
	docker compose exec app php artisan queue:work

# Tinker
tinker:
	docker compose exec app php artisan tinker

# Storage link
storage-link:
	docker compose exec app php artisan storage:link

# Cache clear
cache-clear:
	docker compose exec app php artisan cache:clear
	docker compose exec app php artisan config:clear
	docker compose exec app php artisan route:clear
	docker compose exec app php artisan view:clear

# Logs
logs:
	docker compose logs -f

logs-app:
	docker compose logs -f app

logs-web:
	docker compose logs -f web

logs-db:
	docker compose logs -f db
