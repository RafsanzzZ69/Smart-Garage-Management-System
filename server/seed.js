require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const ServicePackage = require('./models/Servicepackage');
const Expense = require('./models/Expense');
const Inventory = require('./models/Inventory');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not set in .env');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
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
};

const seedPackages = async () => {
  await ServicePackage.deleteMany({});
  console.log('Cleared existing service packages');

  const packages = [
    {
      name: 'Basic Service',
      description: 'Oil change, filter inspection, and basic safety check.',
      services: ['Oil Change', 'Brake Inspection', 'Fluid Top-up'],
      price: 4000,
      estimatedDuration: 60,
      isActive: true
    },
    {
      name: 'Standard Maintenance',
      description: 'Complete maintenance package with tire check and engine tune-up.',
      services: ['Oil Change', 'Brake Inspection', 'Engine Tune-up', 'Tire Check'],
      price: 7500,
      estimatedDuration: 120,
      isActive: true
    },
    {
      name: 'Premium Repair',
      description: 'Advanced repair and diagnostics for complex issues.',
      services: ['Engine Diagnostics', 'Parts Replacement', 'Electrical Repair'],
      price: 15000,
      estimatedDuration: 240,
      isActive: true
    },
    {
      name: 'Engine Overhaul',
      description: 'Deep engine inspection, cleaning and performance restoration.',
      services: ['Engine Inspection', 'Fuel System Clean', 'Performance Tune'],
      price: 22000,
      estimatedDuration: 360,
      isActive: true
    },
    {
      name: 'Transmission Service',
      description: 'Full transmission check and servicing to improve shifting.',
      services: ['Transmission Check', 'Fluid Replacement', 'Component Inspection'],
      price: 18000,
      estimatedDuration: 300,
      isActive: true
    },
    {
      name: 'Air Conditioning Service',
      description: 'AC system inspection, refill and cooling optimization.',
      services: ['AC Diagnostics', 'Refrigerant Top-up', 'Filter Replacement'],
      price: 8500,
      estimatedDuration: 90,
      isActive: true
    },
    {
      name: 'Brake Care',
      description: 'Brake safety package including pad check and rotor inspection.',
      services: ['Brake Pad Inspection', 'Rotor Check', 'Hydraulic System Flush'],
      price: 7000,
      estimatedDuration: 100,
      isActive: true
    },
    {
      name: 'Battery & Electrical',
      description: 'Battery health check plus electrical system diagnostics.',
      services: ['Battery Test', 'Starter Check', 'Electrical System Scan'],
      price: 6000,
      estimatedDuration: 80,
      isActive: true
    },
    {
      name: 'Safety Inspection',
      description: 'Comprehensive inspection for lights, suspension, and brakes.',
      services: ['Suspension Check', 'Light Inspection', 'Safety Review'],
      price: 5000,
      estimatedDuration: 70,
      isActive: true
    }
  ];

  await ServicePackage.insertMany(packages);
  console.log('✅ Default service packages added');
};

const seedExpenses = async () => {
  await Expense.deleteMany({});
  console.log('Cleared existing expenses');

  const expenses = [
    { category: 'Rent', amount: 25000, description: 'Monthly garage space rent', date: new Date('2026-05-01') },
    { category: 'Electricity', amount: 5200, description: 'Monthly electricity bill', date: new Date('2026-05-02') },
    { category: 'Equipment', amount: 12000, description: 'New diagnostic scanner purchase', date: new Date('2026-05-03') },
    { category: 'Maintenance', amount: 3400, description: 'Air conditioner servicing', date: new Date('2026-05-04') },
    { category: 'Other', amount: 800, description: 'Office supplies and stationery', date: new Date('2026-05-05') },
    { category: 'Rent', amount: 25000, description: 'Monthly garage rent', date: new Date('2026-04-01') },
    { category: 'Electricity', amount: 4900, description: 'Electricity bill for April', date: new Date('2026-04-02') },
    { category: 'Equipment', amount: 9500, description: 'Punch tool set', date: new Date('2026-04-05') },
    { category: 'Maintenance', amount: 4200, description: 'Generator maintenance', date: new Date('2026-04-07') },
    { category: 'Other', amount: 1600, description: 'Cleaning supplies', date: new Date('2026-04-09') },
    { category: 'Rent', amount: 25000, description: 'Monthly rent payment', date: new Date('2026-03-01') },
    { category: 'Electricity', amount: 4700, description: 'Electricity invoice for March', date: new Date('2026-03-02') },
    { category: 'Equipment', amount: 14000, description: 'New hydraulic jack', date: new Date('2026-03-10') },
    { category: 'Maintenance', amount: 2800, description: 'Plumbing repair in workshop', date: new Date('2026-03-12') },
    { category: 'Other', amount: 2300, description: 'Uniforms for staff', date: new Date('2026-03-15') },
    { category: 'Rent', amount: 25000, description: 'Garage rent for February', date: new Date('2026-02-01') },
    { category: 'Electricity', amount: 4500, description: 'Electricity bill February', date: new Date('2026-02-03') },
    { category: 'Equipment', amount: 6800, description: 'New battery charger', date: new Date('2026-02-09') },
    { category: 'Maintenance', amount: 3100, description: 'Workshop door repairs', date: new Date('2026-02-14') },
    { category: 'Other', amount: 1200, description: 'Internet and communication charges', date: new Date('2026-02-20') },
    { category: 'Rent', amount: 25000, description: 'Garage rent January', date: new Date('2026-01-01') },
    { category: 'Electricity', amount: 4300, description: 'January electricity bill', date: new Date('2026-01-03') },
    { category: 'Equipment', amount: 5400, description: 'New wrenches and socket set', date: new Date('2026-01-08') },
    { category: 'Maintenance', amount: 2900, description: 'Parking area maintenance', date: new Date('2026-01-11') },
    { category: 'Other', amount: 1800, description: 'Coffee and refreshments', date: new Date('2026-01-18') }
  ];

  await Expense.insertMany(expenses);
  console.log('✅ Default expenses added');
};

const seedInventory = async () => {
  await Inventory.deleteMany({});
  console.log('Cleared existing inventory');

  const items = [
    { name: 'Engine Oil 5W-30', quantity: 80, supplier: 'AutoCare Supplies', purchasePrice: 1200 },
    { name: 'Brake Pads Set', quantity: 40, supplier: 'BrakeTech Ltd.', purchasePrice: 1800 },
    { name: 'Air Filter', quantity: 60, supplier: 'FilterWorks', purchasePrice: 450 },
    { name: 'Oil Filter', quantity: 75, supplier: 'QuickChange Parts', purchasePrice: 380 },
    { name: 'Battery 12V', quantity: 15, supplier: 'PowerDrive', purchasePrice: 6500 },
    { name: 'Spark Plug', quantity: 120, supplier: 'Ignite Systems', purchasePrice: 300 },
    { name: 'Coolant 1L', quantity: 90, supplier: 'CoolFlow', purchasePrice: 520 },
    { name: 'Radiator Hose', quantity: 35, supplier: 'HoseMaster', purchasePrice: 1100 },
    { name: 'Brake Fluid 1L', quantity: 55, supplier: 'HydroTech', purchasePrice: 650 },
    { name: 'Transmission Fluid 1L', quantity: 50, supplier: 'ShiftPro', purchasePrice: 720 },
    { name: 'Car Wax', quantity: 20, supplier: 'ShinePlus', purchasePrice: 900 },
    { name: 'Tire Pressure Gauge', quantity: 18, supplier: 'GaugePro', purchasePrice: 450 },
    { name: 'Wiper Blade', quantity: 70, supplier: 'ClearView', purchasePrice: 280 },
    { name: 'Battery Charger', quantity: 8, supplier: 'PowerDrive', purchasePrice: 7800 },
    { name: 'Grease Tube', quantity: 65, supplier: 'LubePro', purchasePrice: 150 },
    { name: 'Coolant Flush Kit', quantity: 12, supplier: 'CoolFlow', purchasePrice: 2500 },
    { name: 'Oil Drain Pan', quantity: 10, supplier: 'AutoCare Supplies', purchasePrice: 1350 },
    { name: 'Jack Stands Pair', quantity: 14, supplier: 'LiftSafe', purchasePrice: 4200 },
    { name: 'Tire Repair Kit', quantity: 25, supplier: 'PatchMaster', purchasePrice: 980 },
    { name: 'Fuel Injector Cleaner', quantity: 22, supplier: 'CleanFuel', purchasePrice: 760 },
    { name: 'Shock Absorber', quantity: 20, supplier: 'RideFlex', purchasePrice: 3200 },
    { name: 'Alternator', quantity: 10, supplier: 'PowerDrive', purchasePrice: 10200 },
    { name: 'Starter Motor', quantity: 8, supplier: 'PowerDrive', purchasePrice: 8900 },
    { name: 'Headlight Bulb', quantity: 55, supplier: 'LightWorks', purchasePrice: 220 },
    { name: 'Fuel Pump', quantity: 9, supplier: 'FuelMax', purchasePrice: 5100 },
    { name: 'Timing Belt', quantity: 12, supplier: 'BeltLine', purchasePrice: 2800 },
    { name: 'Wheel Bearing', quantity: 17, supplier: 'BearingPro', purchasePrice: 1150 },
    { name: 'Air Suspension Kit', quantity: 5, supplier: 'RideFlex', purchasePrice: 14200 },
    { name: 'Clutch Kit', quantity: 7, supplier: 'ShiftPro', purchasePrice: 9400 },
    { name: 'Exhaust Clamp', quantity: 48, supplier: 'PipeWorks', purchasePrice: 180 },
    { name: 'Oxygen Sensor', quantity: 18, supplier: 'SensorLabs', purchasePrice: 2100 },
    { name: 'Cabin Air Filter', quantity: 52, supplier: 'FilterWorks', purchasePrice: 420 },
    { name: 'Serpentine Belt', quantity: 23, supplier: 'BeltLine', purchasePrice: 650 },
    { name: 'Engine Mount', quantity: 11, supplier: 'MountMaster', purchasePrice: 2350 },
    { name: 'Wheel Nut Set', quantity: 32, supplier: 'BoltWorks', purchasePrice: 320 },
    { name: 'Brake Caliper', quantity: 14, supplier: 'BrakeTech Ltd.', purchasePrice: 5200 },
    { name: 'Air Compressor Oil', quantity: 27, supplier: 'LubePro', purchasePrice: 420 },
    { name: 'Coolant Reservoir', quantity: 16, supplier: 'CoolFlow', purchasePrice: 1380 }
  ];

  await Inventory.insertMany(items);
  console.log('✅ Default inventory items added');
};

const runSeed = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedPackages();
    await seedExpenses();
    await seedInventory();
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeed();
