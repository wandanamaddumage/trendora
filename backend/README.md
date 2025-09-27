# Laravel REST API with Docker

A production-grade Laravel 11 REST API with full Docker setup, featuring user management, product catalog, shopping cart, and admin functionality.

## Features

- **Authentication**: Laravel Sanctum personal access tokens
- **User Management**: Admin, staff, and customer roles with privileges
- **Product Catalog**: CRUD operations with image upload and filtering
- **Shopping Cart**: Customer cart management
- **Admin Dashboard**: User management and metrics
- **Docker Setup**: Complete containerized development environment
- **Testing**: Feature and unit tests with CI/CD
- **Documentation**: OpenAPI 3.1 specification

## Tech Stack

- Laravel 11
- PHP 8.3 FPM
- Nginx
- MySQL 8
- Redis (caching/queues)
- Mailpit (development email testing)

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Make (optional, for convenience commands)

### Installation

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd server
   cp env.example .env
   ```

2. **Start the application**:

   ```bash
   make up
   # or: docker compose up -d --build
   ```

3. **Install dependencies and setup**:

   ```bash
   make composer
   make keygen
   make migrate-fresh-seed
   ```

4. **Access the API**:
   - API: http://localhost:8080/api/v1/health
   - Mailpit: http://localhost:8026

## API Endpoints

### Health Check

- `GET /api/v1/health` - Health check (no auth)

### Authentication

- `POST /api/v1/auth/register` - Register customer
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout (auth required)
- `GET /api/v1/auth/me` - Get current user (auth required)

### Profile

- `GET /api/v1/profile` - Get profile (auth required)
- `PATCH /api/v1/profile` - Update profile (auth required)

### Products

- `GET /api/v1/products` - List products (public)
- `GET /api/v1/products/{id}` - Get product (public)
- `POST /api/v1/products` - Create product (staff + privilege)
- `PUT/PATCH /api/v1/products/{id}` - Update product (staff + privilege)
- `DELETE /api/v1/products/{id}` - Delete product (staff + privilege)
- `PATCH /api/v1/products/{id}/toggle-active` - Toggle active (staff + privilege)
- `POST /api/v1/products/{id}/image` - Upload image (staff + privilege)

### Cart (Customer)

- `GET /api/v1/cart` - Get cart (customer auth)
- `POST /api/v1/cart/items` - Add item (customer auth)
- `PATCH /api/v1/cart/items/{id}` - Update item (customer auth)
- `DELETE /api/v1/cart/items/{id}` - Remove item (customer auth)
- `DELETE /api/v1/cart` - Clear cart (customer auth)

### Admin

- `GET /api/v1/admin/customers` - List customers (admin)
- `PATCH /api/v1/admin/customers/{id}/toggle-active` - Toggle customer (admin)
- `DELETE /api/v1/admin/customers/{id}` - Delete customer (admin)
- `GET /api/v1/admin/users` - List users (admin)
- `POST /api/v1/admin/users` - Create user (admin)
- `PUT/PATCH /api/v1/admin/users/{id}` - Update user (admin)
- `PATCH /api/v1/admin/users/{id}/toggle-active` - Toggle user (admin)
- `PATCH /api/v1/admin/users/{id}/privileges` - Update privileges (admin)
- `DELETE /api/v1/admin/users/{id}` - Delete user (admin)
- `GET /api/v1/admin/metrics` - Get metrics (admin)

## Development Commands

```bash
# Container management
make up          # Start containers
make down        # Stop containers
make fresh       # Rebuild everything

# Laravel commands
make composer    # Install dependencies
make keygen      # Generate app key
make migrate     # Run migrations
make seed        # Run seeders
make migrate-fresh-seed  # Fresh migrations + seed

# Testing & Quality
make test        # Run tests
make pint        # Code formatting
make stan        # Static analysis

# Development
make bash        # Shell into app container
make tinker      # Laravel tinker
make queue       # Run queue worker
make logs        # View logs
```

## Database Schema

### Users

- `id`, `role` (admin/user/customer), `first_name`, `last_name`, `email`, `contact`, `password`, `is_active`, `timestamps`, `soft_deletes`

### User Privileges

- `user_id`, `can_create_product`, `can_update_product`, `can_delete_product`

### Products

- `id`, `brand`, `name`, `image_path`, `quantity`, `cost_price`, `sell_price`, `description`, `rating`, `is_active`, `created_by`, `updated_by`, `timestamps`, `soft_deletes`

### Carts

- `id`, `customer_id`, `timestamps`

### Cart Items

- `id`, `cart_id`, `product_id`, `quantity`, `unit_price_snapshot`, `line_total`, `timestamps`

## Authentication & Authorization

- **Sanctum Tokens**: Personal access tokens for API authentication
- **Role-based Access**: Admin, staff (admin/user), customer roles
- **Privilege System**: Granular permissions for product operations
- **Middleware**: `auth:sanctum`, `role`, `product.privilege`

## Testing

```bash
make test        # Run all tests
make test -- --filter=ProductTest  # Run specific test
```

## API Documentation

- OpenAPI 3.1 spec: `docs/openapi.yaml`
- Postman collection: `docs/collection.json`
- API documentation: `docs/README.md`

## Production Deployment

1. Update environment variables for production
2. Set `APP_ENV=production` and `APP_DEBUG=false`
3. Configure proper database and Redis connections
4. Set up SSL/TLS certificates
5. Configure proper logging and monitoring

## Contributing

1. Follow PSR-12 coding standards
2. Write tests for new features
3. Update documentation
4. Run `make pint` and `make stan` before committing

## License

MIT License
