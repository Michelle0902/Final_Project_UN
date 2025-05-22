/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication
 */

import express from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [admin, user]
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res): Promise<any> => {
  const { username, password } = req.body;
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  const user = await User.findOne({ username: cleanUsername });

  if (!user || !(await bcrypt.compare(cleanPassword, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      username: user.username,
      role: user.role,
    },
  });
});

export default router;
