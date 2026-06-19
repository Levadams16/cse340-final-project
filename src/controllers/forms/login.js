import { Router } from 'express';
import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { loginValidation } from '../../middleware/validation/forms.js';

const router = Router();

const showLoginForm = (req, res) => {
    res.render('forms/login/form', { title: 'Log In' });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const passwordValid = await verifyPassword(password, user.password);

        if (!passwordValid) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        delete user.password;
        req.session.user = user;
        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/account');

    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout };