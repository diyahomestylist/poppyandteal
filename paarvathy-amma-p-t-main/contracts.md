# API Contracts - Poppy & Teal Macramé Store

## Overview
This document outlines the API contracts for transforming the frontend-only macramé store into a full-stack application with database integration, user authentication, order processing, admin panel, and email notifications.

## Backend Implementation Plan

### 1. Database Models

#### User Model
```python
- id: ObjectId (primary key)
- email: str (unique, required)
- password: str (hashed, required)
- first_name: str (required)
- last_name: str (required)
- role: str (enum: "customer", "admin", default: "customer")
- is_active: bool (default: True)
- created_at: datetime
- updated_at: datetime
- address: {
    street: str,
    city: str,
    state: str,
    postal_code: str,
    country: str
}
```

#### Product Model
```python
- id: ObjectId (primary key)
- name: str (required)
- description: str (required)
- price: float (required)
- category: str (required)
- image: str (required, URL/path)
- images: [str] (additional images)
- in_stock: bool (default: True)
- stock_quantity: int (default: 0)
- featured: bool (default: False)
- created_at: datetime
- updated_at: datetime
- metadata: {
    materials: [str],
    dimensions: str,
    care_instructions: str
}
```

#### Order Model
```python
- id: ObjectId (primary key)
- user_id: ObjectId (ref: User)
- items: [{
    product_id: ObjectId (ref: Product),
    name: str,
    price: float,
    quantity: int,
    subtotal: float
}]
- total_amount: float
- status: str (enum: "pending", "confirmed", "processing", "shipped", "delivered", "cancelled")
- payment_status: str (enum: "pending", "paid", "failed", "refunded")
- shipping_address: {
    street: str,
    city: str,
    state: str,
    postal_code: str,
    country: str
}
- created_at: datetime
- updated_at: datetime
- notes: str
```

#### Contact Model
```python
- id: ObjectId (primary key)
- name: str (required)
- email: str (required)
- subject: str (required)
- message: str (required)
- status: str (enum: "new", "read", "replied", default: "new")
- created_at: datetime
```

### 2. API Endpoints

#### Authentication Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user profile
- PUT /api/auth/profile - Update user profile
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password

#### Products Endpoints
- GET /api/products - Get all products (with filtering, pagination)
- GET /api/products/{id} - Get single product
- POST /api/products - Create product (admin only)
- PUT /api/products/{id} - Update product (admin only)
- DELETE /api/products/{id} - Delete product (admin only)
- GET /api/products/categories - Get all categories
- GET /api/products/featured - Get featured products

#### Orders Endpoints
- POST /api/orders - Create new order
- GET /api/orders - Get user's orders
- GET /api/orders/{id} - Get single order
- PUT /api/orders/{id}/status - Update order status (admin only)
- GET /api/admin/orders - Get all orders (admin only)

#### Contact Endpoints
- POST /api/contact - Submit contact form
- GET /api/admin/contacts - Get all contacts (admin only)
- PUT /api/admin/contacts/{id} - Update contact status (admin only)

#### Admin Endpoints
- GET /api/admin/dashboard - Get dashboard stats
- GET /api/admin/users - Get all users
- PUT /api/admin/users/{id} - Update user (admin only)

### 3. Frontend Integration Changes

#### Remove Mock Data
- Replace mock.js imports with API calls
- Remove localStorage cart logic
- Implement proper state management

#### API Integration Points
- Hero slider: GET /api/products/featured
- Product grid: GET /api/products
- Cart functionality: POST /api/orders
- User authentication: Login/Register forms
- Contact form: POST /api/contact
- Product management: Admin CRUD operations

#### New Frontend Components Needed
- Login/Register modals
- User profile component
- Order history component
- Admin dashboard
- Admin product management
- Order tracking component

### 4. Email Notifications

#### Email Templates Needed
- Welcome email (user registration)
- Order confirmation
- Order status updates
- Contact form submission (admin notification)
- Password reset
- Admin notifications for new orders

#### Email Service Integration
- Use SMTP configuration
- HTML email templates
- Background email sending

### 5. Security Features
- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS configuration
- Admin route protection

### 6. Admin Panel Features
- Dashboard with sales statistics
- Product management (CRUD)
- Order management
- User management
- Contact message management
- Email template management

## Implementation Priority

1. **Phase 1**: Database models and basic CRUD operations
2. **Phase 2**: User authentication system
3. **Phase 3**: Order processing and email notifications
4. **Phase 4**: Admin panel functionality
5. **Phase 5**: Frontend-backend integration
6. **Phase 6**: Testing and refinement

## Environment Variables Needed
```
MONGO_URL=<existing>
JWT_SECRET=<to be generated>
JWT_EXPIRES_IN=7d
SMTP_HOST=<email service>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<email password>
ADMIN_EMAIL=<admin email>
FRONTEND_URL=<frontend URL>
```

This contract ensures seamless transformation from mock data to a fully functional e-commerce platform while maintaining the beautiful studio-master design.