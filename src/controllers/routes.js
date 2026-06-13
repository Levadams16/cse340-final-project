import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Welcome to the Dealership' });
});

export default router;