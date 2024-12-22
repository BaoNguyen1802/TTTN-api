// routes/index.js
const express = require('express');
const router = express.Router();

// Import individual route files
const carRoutes = require('./product');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const orderRoutes = require('./order');
const orderrRoutes = require('./orderr');


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/product', carRoutes);
router.use('/order', orderRoutes);
router.use('/orderr', orderrRoutes);

module.exports = router;
