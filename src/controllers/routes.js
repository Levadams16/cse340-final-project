import express from 'express';
import loginRoutes, { processLogout } from './forms/login.js';
import registrationRoutes from './forms/registration.js';
import inventoryRoutes from './inventory/vehicles.js';
import { requireLogin } from '../middleware/auth.js';
import contactRoutes from './forms/contact.js';
import serviceRoutes from './forms/service.js';
import adminRoutes from './admin/admin.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { 
        title: 'Welcome to Our Dealership',
        styles: ['<link rel="stylesheet" href="/css/home.css">']
    });
});

router.use('/login', loginRoutes);
router.use('/register', registrationRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/contact', contactRoutes);
router.use('/service', serviceRoutes);
router.use('/admin', adminRoutes);
router.get('/logout', processLogout);


router.get('/account', requireLogin, (req, res) => {
    res.render('account', { 
        title: 'My Account', 
        user: req.session.user,
        styles: []
    });
});

export default router;