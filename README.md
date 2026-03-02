# 🛒 Bangla Bazar

**Bangla Bazar** is a full-stack mini e-commerce web application built with **ASP.NET Core Web API**, **React**, and **MySQL**.  
It is designed to simulate a real-world online grocery store focusing on traditional Bengali daily essentials such as mustard oil, dried chili, turmeric, and other grocery products.

This project demonstrates backend architecture, RESTful API design, authentication, and full-stack integration suitable for internship-level production-ready applications.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based Authentication
- Role-based Authorization (Admin / Customer)

### 🛍️ Product Management
- Add, update, delete products (Admin)
- Category-wise product filtering
- Product search & pagination

### 🛒 Shopping Cart
- Add to cart
- Update quantity
- Remove items
- View user-specific cart

### 📦 Order & Checkout
- Place order from cart
- Order history
- Order details tracking

### 🧠 Backend Highlights
- ASP.NET Core Web API
- Entity Framework Core with MySQL
- Repository & Service Layer Pattern
- DTO Mapping (AutoMapper)
- Global Exception Handling Middleware
- Clean & Scalable Architecture

---

## 🏗️ Tech Stack

### 🔙 Backend
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT Authentication
- LINQ

### 🎨 Frontend
- React
- Axios
- React Router
- Bootstrap / Tailwind CSS (optional)

---

## 📂 Project Structure
BanglaBazar/ <br>
├── BanglaBazar.API # Controllers & API configuration <br>
├── BanglaBazar.Application # Services, DTOs, Interfaces <br>
├── BanglaBazar.Domain # Entities & Models <br>
├── BanglaBazar.Infrastructure # DbContext, Repositories <br>
└── BanglaBazar.React # Frontend (React App) <br>


---

## 🗄️ Database Schema (Core Entities)

- Users
- Categories
- Products
- CartItems
- Orders
- OrderItems

**Relationships**
- User → Orders (One-to-Many)
- Order → OrderItems (One-to-Many)
- Product → OrderItems (One-to-Many)
- Category → Products (One-to-Many)
- User → CartItems (One-to-Many)

---

## ⚙️ Getting Started

### 🔧 Backend Setup
cd BanglaBazar.API
dotnet restore
dotnet ef database update
dotnet run

### 🎨 Frontend Setup
cd BanglaBazar.React
npm install
npm start

### 📖 API Documentation
Swagger UI available at:
https://localhost:{port}/swagger

---

## 🎯 Learning Objectives
This project was built to practice and demonstrate:
1. RESTful API development with .NET
2. Authentication & Authorization using JWT
3. EF Core relationships & LINQ queries
4. Clean Architecture & layered design
5. Full-stack integration with React

## 📌 Future Improvements
1. Payment gateway integration
2. Image upload for products
3. Admin dashboard analytics
4. Cloud deployment (Azure / AWS)
---

## 👨‍💻 Author
Siam Hossain <br>
Aspiring Software Engineer | .NET Developer

### ⭐ Acknowledgement

This project is developed for learning purposes and portfolio demonstration as part of internship preparation.
