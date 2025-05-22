// scripts/seedUsers.ts
import mongoose from 'mongoose';
import User from '../src/models/User';

mongoose.connect('mongodb://localhost:27017/product-review-app/product-review-app');

const run = async () => {
  await User.create([
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' },
  ]);
  console.log('✅ Seeded users');
  process.exit();
};

run();
