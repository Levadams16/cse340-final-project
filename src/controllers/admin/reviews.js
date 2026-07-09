import { Router } from 'express';
import { requireRole } from '../../middleware/auth.js';
import { getAllReviews, deleteReview } from '../../models/forms/review.js';

const router = Router();

const showAllReviews = async (req, res) => {
    let reviews = [];

    try {
        reviews = await getAllReviews();
    } catch (error) {
        console.error('Error loading reviews:', error);
        req.flash('error', 'Unable to load reviews.');
    }

    res.render('admin/reviews', {
        title: 'Moderate Reviews',
        reviews,
        styles: []
    });
};

const processDeleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await deleteReview(id);
        if (deleted) {
            req.flash('success', 'Review deleted successfully.');
        } else {
            req.flash('error', 'Review not found.');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Unable to delete review.');
    }

    res.redirect('/admin/reviews');
};

router.get('/', requireRole('owner', 'employee'), showAllReviews);
router.post('/:id/delete', requireRole('owner', 'employee'), processDeleteReview);

export default router;
