import { Router } from 'express';
import { validationResult, body } from 'express-validator';
import { requireLogin } from '../../middleware/auth.js';
import {
    createReview,
    getReviewsByUser,
    getReviewById,
    updateReview,
    deleteReview,
    hasUserReviewedVehicle
} from '../../models/forms/review.js';
import { getVehicleById } from '../../models/inventory/vehicles.js';

const router = Router();

const reviewValidation = [
    body('rating')
        .notEmpty().withMessage('Please select a rating.')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('reviewText')
        .trim()
        .notEmpty().withMessage('Review text cannot be empty.')
        .isLength({ min: 10 }).withMessage('Review must be at least 10 characters.')
];

// Show review submission form
const showReviewForm = async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const vehicle = await getVehicleById(vehicleId);

        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/inventory');
        }

        const alreadyReviewed = await hasUserReviewedVehicle(req.session.user.id, vehicleId);

        if (alreadyReviewed) {
            req.flash('error', 'You have already reviewed this vehicle.');
            return res.redirect(`/inventory/${vehicleId}`);
        }

        res.render('forms/review/form', {
            title: `Review: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicle,
            review: null,
            styles: []
        });
    } catch (error) {
        console.error('Error loading review form:', error);
        req.flash('error', 'Unable to load review form.');
        res.redirect('/inventory');
    }
};

// Process review submission
const processReview = async (req, res) => {
    const { vehicleId } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/inventory/${vehicleId}/review`);
    }

    const { rating, reviewText } = req.body;

    try {
        await createReview(req.session.user.id, vehicleId, rating, reviewText);
        req.flash('success', 'Your review has been submitted!');
        res.redirect(`/inventory/${vehicleId}`);
    } catch (error) {
        console.error('Error submitting review:', error);
        req.flash('error', 'Unable to submit your review. Please try again.');
        res.redirect(`/inventory/${vehicleId}/review`);
    }
};

// Show all reviews by the logged-in user
const showMyReviews = async (req, res) => {
    let reviews = [];

    try {
        reviews = await getReviewsByUser(req.session.user.id);
    } catch (error) {
        console.error('Error loading reviews:', error);
        req.flash('error', 'Unable to load your reviews.');
    }

    res.render('forms/review/list', {
        title: 'My Reviews',
        reviews,
        styles: []
    });
};

// Show edit review form
const showEditForm = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await getReviewById(id);

        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/reviews');
        }

        if (review.user_id !== req.session.user.id) {
            req.flash('error', 'You can only edit your own reviews.');
            return res.redirect('/reviews');
        }

        const vehicle = await getVehicleById(review.vehicle_id);

        res.render('forms/review/form', {
            title: 'Edit Review',
            vehicle,
            review,
            styles: []
        });
    } catch (error) {
        console.error('Error loading edit form:', error);
        req.flash('error', 'Unable to load review.');
        res.redirect('/reviews');
    }
};

// Process edit review
const processEditReview = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/reviews/${id}/edit`);
    }

    const { rating, reviewText } = req.body;

    try {
        const review = await getReviewById(id);

        if (!review || review.user_id !== req.session.user.id) {
            req.flash('error', 'You can only edit your own reviews.');
            return res.redirect('/reviews');
        }

        await updateReview(id, rating, reviewText);
        req.flash('success', 'Your review has been updated.');
        res.redirect('/reviews');
    } catch (error) {
        console.error('Error updating review:', error);
        req.flash('error', 'Unable to update review.');
        res.redirect(`/reviews/${id}/edit`);
    }
};

// Delete review
const processDeleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await getReviewById(id);

        if (!review || review.user_id !== req.session.user.id) {
            req.flash('error', 'You can only delete your own reviews.');
            return res.redirect('/reviews');
        }

        await deleteReview(id);
        req.flash('success', 'Review deleted successfully.');
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash('error', 'Unable to delete review.');
    }

    res.redirect('/reviews');
};

router.get('/my', requireLogin, showMyReviews);
router.get('/:id/edit', requireLogin, showEditForm);
router.post('/:id/edit', requireLogin, reviewValidation, processEditReview);
router.post('/:id/delete', requireLogin, processDeleteReview);

export { router as reviewRoutes };
export { showReviewForm, processReview, reviewValidation };
