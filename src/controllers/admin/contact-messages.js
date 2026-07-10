import { Router } from 'express';
import { requireRole } from '../../middleware/auth.js';
import { getAllContactMessages, updateContactMessageStatus } from '../../models/forms/contact.js';

const router = Router();

const showContactMessages = async (req, res) => {
    let messages = [];

    try {
        messages = await getAllContactMessages();
    } catch (error) {
        console.error('Error loading contact messages:', error);
        req.flash('error', 'Unable to load contact messages.');
    }

    res.render('admin/contact-messages', {
        title: 'Contact Messages',
        messages,
        styles: []
    });
};

const processMarkReplied = async (req, res) => {
    const { id } = req.params;

    try {
        await updateContactMessageStatus(id, 'replied');
        req.flash('success', 'Message marked as replied.');
    } catch (error) {
        console.error('Error updating message status:', error);
        req.flash('error', 'Unable to update message status.');
    }

    res.redirect('/admin/contact-messages');
};

const processMarkClosed = async (req, res) => {
    const { id } = req.params;

    try {
        await updateContactMessageStatus(id, 'closed');
        req.flash('success', 'Message closed.');
    } catch (error) {
        console.error('Error closing message:', error);
        req.flash('error', 'Unable to close message.');
    }

    res.redirect('/admin/contact-messages');
};

router.get('/', requireRole('owner', 'employee'), showContactMessages);
router.post('/:id/replied', requireRole('owner', 'employee'), processMarkReplied);
router.post('/:id/closed', requireRole('owner', 'employee'), processMarkClosed);

export default router;
