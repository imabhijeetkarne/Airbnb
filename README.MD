# Airbnb Clone - MERN Stack Project

A full-stack Airbnb clone built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to browse, book, and list properties for rent.

## 🚀 Features

### User Authentication
- User registration and login with JWT authentication
- Protected routes and role-based access control
- Session management with secure HTTP-only cookies

### Property Listings
- Browse available properties with filters
- View property details with high-quality images
- Search functionality by location, price range, and property type
- Pagination for better performance

### Booking System
- Real-time availability calendar
- Secure payment integration (stripe)
- Booking history and management
- Email notifications for bookings

### User Dashboard
- User profile management
- Property management for hosts
- Booking history and status tracking
- Wishlist functionality

### Admin Panel
- User management
- Property approval system
- Booking management
- Analytics and reporting

## 🛠️ Tech Stack

### Frontend
- **React.js** - Frontend library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Redux/Context API** - State management
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Date Picker** - Date selection
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Nodemailer** - Email notifications
- **Stripe** - Payment processing

## 📦 Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account (for image storage)

## 🚀 Getting Started

### Backend Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/imabhijeetkarne/Airbnb.git](https://github.com/imabhijeetkarne/Airbnb.git)
   cd Airbnb/backend

2. Install dependencies
   ```bash
    npm install
    # or
    yarn

3. create both frontend and backend .env file

4. Start the backend server:
    ```bash
    node index.js


5. Frontend Setup
    Navigate to the frontend directory:
    ```bash
    cd Airbnb/frontend

6. Install dependencies:
    ```bash
    npm install
    # or
    yarn

7. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev



### 🤝 Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request