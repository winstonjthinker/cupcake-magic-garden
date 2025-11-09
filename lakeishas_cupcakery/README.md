# 🍰 Lakeisha's Cupcakery - Backend System

## Project Overview

A modular, scalable Django REST API backend for Lakeisha's Cupcakery, following enterprise-grade architecture patterns. This backend provides a robust foundation for web and mobile applications with built-in user management, API endpoints, and development utilities.

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and profile management
- Session-based authentication
- Permission-based access control
- Custom user model with extended fields
- Secure password management

### 🛠️ Core API Functionality
- RESTful API endpoints with proper HTTP status codes
- JSON request/response format
- Input validation and serialization
- Pagination and filtering support
- API versioning readiness

### 👥 User Management
- User CRUD operations
- Profile management (avatar, contact info)
- Admin interface for user management
- Secure authentication flows

## 🏗️ Project Structure

```
lakeishas_cupcakery/
├── core/                 # Project configuration
│   ├── settings/        # Environment-specific settings
│   │   ├── base.py     # Common settings
│   │   ├── development.py
│   │   └── production.py
│   └── urls.py         # Main URL routing
├── users/               # User management app
│   ├── models.py       # Custom user model
│   ├── serializers.py  # User serializers
│   ├── views.py        # Authentication views
│   └── urls.py         # User endpoints
├── api/                 # Business logic app
│   ├── views.py        # API endpoints
│   └── urls.py         # API routing
├── utils/               # Shared utilities
│   ├── helpers.py      # Common functions
│   └── constants.py    # App constants
├── static/             # Static assets
├── media/              # User uploads
└── requirements.txt    # Python dependencies
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- SQLite (development)
- PostgreSQL (production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/winstonjthinker/cupcake-magic-garden.git
   cd cupcake-magic-garden/lakeishas_cupcakery
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root with the following variables:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///db.sqlite3
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register/` - Register a new user
- `POST /api/users/login/` - User login
- `GET /api/users/profile/` - Get current user profile
- `PUT /api/users/profile/` - Update user profile

### System Health
- `GET /api/health/` - Check system status

## 🔧 Development

### Running Tests
```bash
python manage.py test
```

### Code Style
This project follows PEP 8 style guidelines. To check your code:
```bash
flake8 .
```

## 🚀 Deployment

### Production Setup
1. Set `DEBUG=False` in your production settings
2. Configure a production database (PostgreSQL recommended)
3. Set up a production web server (Nginx + Gunicorn)
4. Configure static files for production

### Docker (Optional)
A `Dockerfile` and `docker-compose.yml` are provided for containerized deployment.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## 📧 Contact

For support or questions, please contact [Your Email].
