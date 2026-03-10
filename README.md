# Smart Garage Management System (SGMS)

A full-stack MERN application for managing a vehicle repair garage digitally.

## Features

- Multi-role authentication (Admin, Mechanic, Customer)
- Admin dashboard with financial analytics
- Service lifecycle management
- Inventory and expense tracking
- Booking system
- Payment integration
- Real-time notifications
- Automated reminders
- Invoice generation
- And more...

## Tech Stack

- **Frontend:** React.js, React Router, Axios, Recharts, Bootstrap
- **Backend:** Node.js, Express.js, JWT, bcrypt
- **Database:** MongoDB Atlas, Mongoose
- **Real-time:** Socket.io
- **Payments:** Stripe
- **Email/SMS:** Nodemailer, external APIs

## Installation

1. Clone the repository
2. Set up MongoDB Atlas and get connection string
3. Configure environment variables in `server/.env`
4. Install backend dependencies: `cd server && npm install`
5. Install frontend dependencies: `cd client && npm install`

## Running the Application

1. Start the backend: `cd server && npm run dev`
2. Start the frontend: `cd client && npm start`
3. Open `http://localhost:3000` in your browser

## Deployment

- Backend: Deploy to Render or Railway
- Frontend: Deploy to Vercel or Netlify
- Database: MongoDB Atlas

## Project Structure

```
server/
  - controllers/
  - models/
  - routes/
  - middleware/
  - services/
  - utils/
  - config/
client/
  - src/
    - components/
    - pages/
    - context/
    - services/
```

## Contributing

Feel free to contribute to this project.

## License

ISC