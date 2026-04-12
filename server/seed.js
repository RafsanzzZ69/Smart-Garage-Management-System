require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
let mongoServer;
const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Memory Server');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};
const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Cleared existing users');
    const users = [
      {
        name: 'Admin User',
        email: 'admin@sgms.com',
        password: await bcrypt.hash('admin123', 8),
        role: 'Admin'
      },
      {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: await bcrypt.hash('customer123', 8),
        role: 'Customer'
      },
      {
        name: 'Test Mechanic',
        email: 'mechanic@test.com',
        password: await bcrypt.hash('mechanic123', 8),
        role: 'Mechanic'
      }
    ];
    const createdUsers = await User.insertMany(users);
    console.log('✅ Test users created successfully:');
    createdUsers.forEach(user => {
      console.log(`   - Email: ${user.email}, Password: ${user.email.includes('admin') ? 'admin123' : user.email.includes('mechanic') ? 'mechanic123' : 'customer123'} (${user.role})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};
connectDB().then(seedUsers);
