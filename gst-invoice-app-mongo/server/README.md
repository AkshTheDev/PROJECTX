# GST Invoice App - Server

A comprehensive Node.js/Express server for managing GST invoices, clients, and business profiles.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes with middleware

### Business Management
- Business profile creation and updates
- GST number management
- Business address management

### Client Management
- Create, read, update, delete clients
- Client search and pagination
- GST number tracking for clients

### Invoice Management
- Create invoices with multiple items
- GST calculations (CGST, SGST, IGST)
- Invoice status tracking (DRAFT, PENDING, PAID, OVERDUE, UNPAID)
- Invoice history with search and filtering
- Invoice summary statistics

### GST Reports
- GST summary reports
- Rate-wise GST analysis
- Monthly GST reports
- Date range filtering

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Profile Management
- `GET /api/profile` - Get user and business profile
- `PUT /api/profile/user` - Update user profile
- `PUT /api/profile/business` - Update business profile

### Client Management
- `POST /api/clients` - Create new client
- `GET /api/clients` - Get all clients (with pagination and search)
- `GET /api/clients/:id` - Get single client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoice Management
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices` - Get all invoices (with pagination, search, and filtering)
- `GET /api/invoices/:id` - Get single invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/summary` - Get invoice summary statistics

### GST Reports
- `GET /api/gst-reports/summary` - Get GST summary report
- `GET /api/gst-reports/rate-wise` - Get rate-wise GST report
- `GET /api/gst-reports/monthly` - Get monthly GST report

# GST Invoice App - Backend API

Express + TypeScript + MongoDB backend for GST invoice management system.

## Deployment (Production)

This backend is deployed on **Render**. For complete deployment instructions, see [DEPLOYMENT_GUIDE.md](../../DEPLOYMENT_GUIDE.md).

**Quick Deploy:**
- Repository: https://github.com/AkshTheDev/GST-backend
- Platform: Render Web Service
- Runtime: Node.js
- Build: `npm install && npm run build`
- Start: `npm start`
- Environment: Set all variables listed below in Render dashboard

## Local Development Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the server root directory:
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/gst-invoice-app?retryWrites=true&w=majority
   
   # JWT Secret (use a strong secret in production)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=5000
   
   # Environment
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or build and run
   npm run build
   npm start
   ```

## Database Models

### User
- email (unique)
- passwordHash
- fullName
- phone
- notificationsOn

### Business
- name
- address
- gstin
- user (reference to User)

### Client
- name
- address
- gstin
- contact
- business (reference to Business)

### Invoice
- invoiceNumber (unique per business)
- invoiceDate
- dueDate
- status
- notes
- subtotal
- cgstAmount
- sgstAmount
- igstAmount
- total
- business (reference to Business)
- client (reference to Client)
- items (array of invoice items)

### Invoice Item
- description
- hsnSac
- quantity
- rate
- gstRate
- amount

## Error Handling

The server includes comprehensive error handling for:
- Validation errors
- Duplicate key errors
- JWT authentication errors
- Database connection errors
- 404 route not found errors

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- CORS configuration

## Development

The server uses TypeScript and includes:
- Type definitions for all models
- Interface definitions for request/response types
- Comprehensive error handling
- MongoDB aggregation pipelines for reports
- Pagination and search functionality

## Production Considerations

- Use environment variables for sensitive data
- Implement rate limiting
- Add request logging
- Use HTTPS in production
- Implement proper backup strategies
- Monitor database performance
- Add API documentation (Swagger/OpenAPI)
