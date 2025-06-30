# 🩺 MERN Appointment Task

A MERN stack application that allows:
- **Users**: Create, update, read, and delete appointments.
- **Admin**: View all users and appointments.
  
- ## Requirements

- Node.js (v20.x or later)
- Mongodb
- `npm`

## Environment Variables

Create a `.env` file in the root of backend directory. The file should contain the following variables:

### Backend (.env, .env.development, .env.production.)

```env
# Backend
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.prexe4i.mongodb.net
JWT_SECRET=your_jwt_secret
PORT=3000

NOTE: change the scripts in package.json depending upon your os to set NODE environment.
```

### Starting the Application

### Backend

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run start:dev
   ```

   The backend server will be running on `http://localhost:3000` by default.

### Frontend

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend application will be running on `http://localhost:5173` by default.


### Admin

1. Navigate to the admin directory:

   ```bash
   cd admin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the admin development server:

   ```bash
   npm run dev
   ```

   The admin application will be running on `http://localhost:5174` by default.


## Database Setup

Ensure you have mongodb or your preferred database set up. Create a database for the appointment application.

1. **Create Database:**

   Connect to your database and create a new database:

2. **Update `.env` File:**

   Update the `MONGODB_URI` variable in the `.env` file with your database credentials.

The passwords are stored in hashed form for security. Ensure your application uses appropriate hashing methods to match this data.

## Features

- **User Authentication**: Secure login and signup using JSON Web Tokens (JWT).
- **User Dashboard Management**: Manage, edit, and delete appointments in a responsive React-based interface.
- **Fully Responsive UI**: Clean and modern design optimized for all devices.
- **Crud Operations**:Create, update, read, and delete appointments.
- **Admin Panel Dashboard**:Admin dashboard to view all users and appointments.

---

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and ensure tests pass.
4. Submit a pull request with a description of your changes.
---
