# 🌾 KrishiConnect AI

> **An AI-Powered Smart Agriculture Marketplace Connecting Farmers, Consumers, Retailers, and Wholesalers*
---

## 📖 Overview

KrishiConnect AI is a modern, AI-powered agriculture marketplace designed to connect farmers directly with consumers, retailers, and wholesalers. The platform removes intermediaries, improves transparency, and empowers farmers with intelligent tools such as crop recommendations, disease detection, market price prediction, and an AI farming assistant.

The application is built with a scalable full-stack architecture using React, FastAPI, MongoDB, and modern cloud services.

---

# ✨ Key Features

## 👨‍🌾 Farmer Portal

* Farmer Registration & Login
* Secure JWT Authentication
* KYC Verification
* Crop Listing Management
* Inventory Management
* Order Tracking
* Revenue Dashboard
* Sales Analytics
* AI Crop Recommendation
* AI Disease Detection
* Market Price Prediction
* AI Farming Assistant

---

## 🛒 Customer Portal

* User Registration
* Browse Marketplace
* Product Search & Filters
* Shopping Cart
* Wishlist
* Secure Checkout
* Razorpay Integration
* Order Tracking
* Purchase History
* Ratings & Reviews
* Notifications

---

## 🏪 Retailer & Wholesaler Portal

* Bulk Order Management
* Supplier Discovery
* Price Negotiation
* Purchase Analytics
* Order History

---

## 🛠 Admin Portal

* Dashboard Overview
* User Management
* Farmer Verification
* Product Moderation
* Complaint Resolution
* Revenue Analytics
* Reports
* Platform Monitoring

---

# 🤖 AI Features

### AI Crop Recommendation

Provides intelligent crop suggestions based on:

* Location
* Soil Type
* Weather Conditions
* Season
* Historical Data

### AI Disease Detection

Upload crop images to receive:

* Disease Name
* Confidence Score
* Treatment Recommendations
* Prevention Tips

### AI Market Prediction

Predicts:

* Market Demand
* Crop Prices
* Profit Estimation
* Seasonal Trends

### AI Farming Assistant

Provides assistance regarding:

* Farming Practices
* Fertilizers
* Pest Control
* Government Schemes
* Market Information

---

# 🚀 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* Zustand / Redux Toolkit
* Axios
* React Hook Form
* Recharts

## Backend

* Python 3.12+
* FastAPI
* JWT Authentication
* OAuth2
* SQLAlchemy
* MongoDB
* Pydantic
* Passlib
* Bcrypt
* Celery
* Redis

## Database

* MongoDB Atlas

## Cloud Services

* Cloudinary
* Razorpay
* Email Notifications
* OTP Verification

---

# 📂 Project Structure

```text
krishiconnect-ai/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── middleware/
│   ├── ai/
│   ├── workers/
│   ├── config/
│   ├── seed/
│   └── main.py
│
├── docs/
├── deployment/
├── docker/
├── .github/
├── README.md
└── docker-compose.yml
```

---

# 🔐 Security

* JWT Access Token
* Refresh Token
* OAuth2 Authentication
* Password Hashing (Bcrypt)
* Role-Based Access Control (RBAC)
* API Rate Limiting
* Secure REST APIs
* Input Validation
* Protected Routes

---

# 📊 Analytics

### Farmer Dashboard

* Revenue Analytics
* Sales Trends
* Product Performance
* Order Growth

### Admin Dashboard

* User Growth
* Revenue Reports
* Active Farmers
* Crop Analytics
* Monthly Performance
* Platform Insights

---

# ⚡ Performance Optimizations

* Lazy Loading
* Code Splitting
* Image Optimization
* API Caching
* Async Background Jobs
* Responsive Design
* Skeleton Loading
* Dark Mode Support

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/yaswanth-reddy642/krishiconnect-ai.git
```

```bash
cd krishiconnect-ai
```

---

## Frontend Setup

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

---

## Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
uvicorn app.main:app --reload
```

---

# ⚙ Environment Variables

### Backend

```env
MONGODB_URI=
JWT_SECRET=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
REFRESH_TOKEN_EXPIRE_DAYS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

EMAIL_USERNAME=
EMAIL_PASSWORD=

REDIS_URL=
```

### Frontend

```env
VITE_API_URL=http://localhost:8000
```

---

# 📚 API Documentation

Once the backend is running:

Swagger UI

```
http://localhost:8000/docs
```

ReDoc

```
http://localhost:8000/redoc
```

---

# 🚀 Deployment

Frontend

* Vercel

Backend

* Render / Railway / Docker

Database

* MongoDB Atlas

Storage

* Cloudinary

---

# 🧪 Future Enhancements

* AI Voice Assistant
* Multi-language Support
* Live Crop Auctions
* IoT Sensor Integration
* Drone Monitoring
* Weather Forecast Dashboard
* Mobile Application
* Blockchain-Based Supply Chain
* Predictive Yield Analysis

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Yaswanth Reddy**

* GitHub: https://github.com/yaswanth-reddy642

---

## ⭐ Support

If you find this project useful, please consider giving it a **Star ⭐** on GitHub. Your support helps improve the project and encourages future development.
