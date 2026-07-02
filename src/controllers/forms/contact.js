import { Router } from 'express';
import { validationResult } from 'express-validator';
import { createContactMessage } from '../../models/forms/contact.js';
import { contactValidation } from '../../middleware/validation/forms.js';

const router = Router();

const showContactForm = (req, res) => {
    res.render('forms/contact/form', { title: 'Contact Us', styles: [] });
};

const handleContactSubmission = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/contact');
    }

    const { name, email, subject, message } = req.body;

    try {
        await createContactMessage(name, email, subject, message);
        req.flash('success', 'Thank you for contacting us! We will respond soon.');
        res.redirect('/contact');
    } catch (error) {
        console.error('Error saving contact message:', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/contact');
    }
};

router.get('/', showContactForm);
router.post('/', contactValidation, handleContactSubmission);

export default router;