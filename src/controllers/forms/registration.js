import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser } from '../../models/forms/registration.js';
import { registrationValidation } from '../../middleware/validation/forms.js';

const router = Router();

const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', { title: 'Create an Account', styles: [] });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const alreadyExists = await emailExists(email);

        if (alreadyExists) {
            req.flash('warning', 'An account with that email already exists.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await saveUser(name, email, hashedPassword);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');

    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

router.get('/', showRegistrationForm);
router.post('/', registrationValidation, processRegistration);

export default router;