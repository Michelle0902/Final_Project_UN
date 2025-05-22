import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import Product from './models/Product';
import Review from './models/Review';
import User from './models/User';

dotenv.config();

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    category: 'Electronics',
    price: 129.99,
    dateAdded: new Date('2025-01-01T00:00:00Z'),
    averageRating: 4.5,
  },
  {
    id: 2,
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with deep bass.',
    category: 'Electronics',
    price: 49.99,
    dateAdded: new Date('2025-01-02T00:00:00Z'),
    averageRating: 4.2,
  },
];

const reviews = [
  {
    id: 1,
    productId: 1,
    author: 'John Doe',
    rating: 5,
    comment: 'Amazing sound quality!',
    date: new Date('2025-01-02T00:00:00Z'),
  },
  {
    id: 2,
    productId: 1,
    author: 'Jane Smith',
    rating: 4,
    comment: 'Great bass, but a bit heavy.',
    date: new Date('2025-01-03T00:00:00Z'),
  },
];

const users = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    username: 'user',
    password: 'user123',
    role: 'user',
  },
];

export async function seedDatabase() {
  try {
    const db = mongoose.connection.useDb('product-review-app');

    const shouldSeed = async (collection: string) => {
      const exists = await db.collection(collection).estimatedDocumentCount();
      return exists === 0;
    };

    if (await shouldSeed('products')) {
      await Product.insertMany(products);
      console.log('✅ Seeded products');
    } else {
      console.log('ℹ️ Products already exist, skipping...');
    }

    if (await shouldSeed('reviews')) {
      await Review.insertMany(reviews);
      console.log('✅ Seeded reviews');
    } else {
      console.log('ℹ️ Reviews already exist, skipping...');
    }

    if (await shouldSeed('users')) {
      const hashedUsers = await Promise.all(
        users.map(async (u) => ({
          username: u.username.toLowerCase(),
          password: await bcrypt.hash(u.password, 10),
          role: u.role,
        }))
      );
      await User.insertMany(hashedUsers);
      console.log('✅ Seeded users');
    } else {
      console.log('ℹ️ Users already exist, skipping...');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// 👇 If run directly from CLI, connect and disconnect manually
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI || '', { dbName: 'product-review-app' })
    .then(async () => {
      console.log('🔌 Connected for seeding');
      await seedDatabase();
      await mongoose.disconnect();
      console.log('🛑 Disconnected after seeding');
    })
    .catch((err) => {
      console.error('❌ Seeder connection error:', err);
    });
}
