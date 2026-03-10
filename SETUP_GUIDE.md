# Smart Garage Management System (SGMS)

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing garage operations, vehicle services, and customer bookings.

## 🚀 Features

### Customer Features
- ✅ Register and login
- ✅ Manage multiple vehicles
- ✅ Book service appointments
- ✅ View booking history and status
- ✅ Track service history
- ✅ View invoices and payments
- ✅ Receive notifications

### Mechanic Features
- ✅ Manage assigned jobs
- ✅ Update job status
- ✅ Track earnings
- ✅ View performance metrics
- ✅ Accept or decline jobs
- ✅ Track completed work

### Admin Features
- ✅ Dashboard with financial overview
- ✅ Manage users (customers, mechanics)
- ✅ Track expenses
- ✅ Manage inventory (spare parts)
- ✅ View service records
- ✅ Generate reports
- ✅ System analytics

## 📋 System Architecture

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT with bcryptjs
- **Middleware**: Custom auth & role-based middleware

### Frontend Stack
- **Framework**: React 19.2.4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Framework**: Bootstrap + Custom CSS
- **Charts**: Recharts

### Database Collections
1. **Users** - Authentication and profiles (Admin, Mechanic, Customer)
2. **Vehicles** - Customer vehicles with details
3. **Services** - Service records and status
4. **Bookings** - Service appointments
5. **Expenses** - Garage operational expenses
6. **Inventory** - Spare parts management
7. **Payments** - Payment records and status
8. **Invoices** - Generated invoices
9. **Notifications** - User notifications

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Git (optional)

### Step 1: Clone or Extract Project
```bash
cd "Smart Garage Management System"
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create `.env` file in server directory (use your own credentials):
```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

Start backend server:
```bash
npm start
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd ../client
npm install
```

Start frontend development server:
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

## 🔐 Test Accounts

### Admin Account
- **Email**: admin@sgms.com
- **Password**: admin123
- **Role**: Admin

### Customer Account
- **Email**: customer@sgms.com
- **Password**: customer123
- **Role**: Customer

### Mechanic Account
- **Email**: mechanic@sgms.com
- **Password**: mechanic123
- **Role**: Mechanic

## 📱 Application Routes

### Public Routes
- `/` - Home page with information
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Role-Based)

#### Admin Dashboard
- `/admin` - Main admin dashboard
  - 📊 Dashboard - Financial overview
  - 💸 Expenses - Track garage expenses
  - 👨‍💼 Employees - Manage mechanics
  - 🔧 Services - View all services
  - 📦 Inventory - Manage spare parts

#### Customer Dashboard
- `/customer` - Customer portal
  - 🏠 Home - Welcome & services overview
  - 🚗 My Vehicles - Add and manage vehicles
  - 📅 My Bookings - View and manage bookings
  - 🔧 Services - Service information

#### Mechanic Dashboard
- `/mechanic` - Mechanic work portal
  - 📋 My Jobs - Assigned service jobs
  - 💰 Earnings - Earnings and payments
  - 📊 Performance - Performance metrics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service status

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking

### Expenses
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Add expense (Admin only)

### Admin Features
- `GET /api/financials` - Financial summary
- `GET /api/users` - Get all users
- `POST /api/users` - Create user (Admin only)

## 🎨 UI/UX Features

### Color Scheme
- **Primary**: Purple to Blue Gradient (#667eea to #764ba2)
- **Secondary**: Dark (#2d3436)
- **Accent**: Red for alerts (#ff6b6b)
- **Success**: Green (#51cf66)

### Responsive Design
- Desktop optimized (1200px+)
- Tablet friendly (768px - 1199px)
- Mobile responsive (< 768px)

### Components
- Professional header with user info
- Tabbed navigation
- Data tables with sorting
- Modal dialogs for actions
- Form validation
- Status badges
- Loading states
- Error handling

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "Admin" | "Mechanic" | "Customer",
  phone: String,
  address: String,
  profileImage: String,
  createdAt: Date
}
```

### Vehicle Model
```javascript
{
  owner: ObjectId (reference to User),
  model: String,
  year: Number,
  licensePlate: String,
  fuelType: String,
  mileage: Number,
  color: String,
  createdAt: Date
}
```

### Service Model
```javascript
{
  customer: ObjectId,
  vehicle: ObjectId,
  mechanic: ObjectId,
  serviceType: String,
  status: "Pending" | "Assigned" | "In Progress" | "Completed",
  description: String,
  estimatedCost: Number,
  actualCost: Number,
  createdAt: Date
}
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)
1. Update API_BASE_URL to production backend
2. Connect GitHub repository
3. Deploy with one click

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (RBAC)
- ✅ Protected routes
- ✅ CORS enabled
- ✅ Input validation
- ✅ Environment variables for secrets

## 📞 Support & Troubleshooting

### MongoDB Connection Issues
- Verify connection string in .env
- Check network access in MongoDB Atlas
- Ensure IP is whitelisted

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend Can't Connect to Backend
- Check backend is running on port 5000
- Verify API_BASE_URL in AuthContext
- Check CORS is enabled in Express

## 📚 File Structure

```
Smart Garage Management System/
├── server/
│   ├── models/           # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth and custom middleware
│   ├── services/        # Business logic
│   ├── config/          # Database config
│   └── server.js        # Express app entry
├── client/
│   ├── src/
│   │   ├── pages/       # Page components (Dashboard, etc.)
│   │   ├── context/     # React Context (Auth)
│   │   ├── components/  # Reusable components
│   │   ├── App.js       # Main app component
│   │   └── index.js     # React entry
│   └── package.json
├── package.json
└── README.md
```

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created with ❤️ for garage management automation.

---

**Last Updated**: December 2024
**Version**: 1.0.0
