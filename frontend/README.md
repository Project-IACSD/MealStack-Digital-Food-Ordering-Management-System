# MealStack - Digital Food Ordering Management System

A full-stack canteen management system built with Spring Boot (Backend) and React (Frontend).

## 🚀 Deployment Links

- **Frontend**: [https://meal-stack-digital-food-ordering-ma.vercel.app](https://meal-stack-digital-food-ordering-ma.vercel.app)
- **Backend API**: [https://mealstack-digital-food-ordering.onrender.com](https://mealstack-digital-food-ordering.onrender.com)
- **Database**: Railway MySQL

## 🛠 Tech Stack

- **Frontend**: React, Material UI, Vite
- **Backend**: Java Spring Boot, Hibernate, MySQL
- **Database**: MySQL (Railway)
- **Deployment**: Vercel (Frontend), Render (Backend), Railway (DB)

## 📸 Key Features

- **Student Portal**: View daily menu, order food, wallet management
- **Admin Portal**: Manage menu, student management, order tracking
- **Image Upload**: Base64 image storage (up to 4GB support)

## 🔧 Database Schema Update (Feb 2026)

The item image storage was upgraded to support large images:
- **New Column**: `item_image` (LONGTEXT) - Stores Base64 images
- **Legacy Column**: `item_img_link` was removed
- **Default Image**: `dosa.jpg` is used as fallback

## 🏃‍♂️ Running Locally

### Backend
```bash
cd Campus-Canteen-Management-System-main/Backend/backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Credentials

- **Admin Login**: `admin@gmail.com` / `admin`
- **Student Login**: Register new account or use existing
