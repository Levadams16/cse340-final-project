import db from '../db.js';

const createReview = async (userId, vehicleId, rating, reviewText) => {
    const query = `
        INSERT INTO reviews (user_id, vehicle_id, rating, review_text)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await db.query(query, [userId, vehicleId, rating, reviewText]);
    return result.rows[0];
};

const getReviewsByVehicle = async (vehicleId) => {
    const query = `
        SELECT 
            reviews.*,
            users.name AS user_name
        FROM reviews
        INNER JOIN users ON reviews.user_id = users.id
        WHERE reviews.vehicle_id = $1
        ORDER BY reviews.created_at DESC
    `;
    const result = await db.query(query, [vehicleId]);
    return result.rows;
};

const getReviewsByUser = async (userId) => {
    const query = `
        SELECT 
            reviews.*,
            vehicles.make,
            vehicles.model,
            vehicles.year
        FROM reviews
        INNER JOIN vehicles ON reviews.vehicle_id = vehicles.id
        WHERE reviews.user_id = $1
        ORDER BY reviews.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const getReviewById = async (id) => {
    const query = `SELECT * FROM reviews WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const updateReview = async (id, rating, reviewText) => {
    const query = `
        UPDATE reviews
        SET rating = $1, review_text = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
    `;
    const result = await db.query(query, [rating, reviewText, id]);
    return result.rows[0] || null;
};

const deleteReview = async (id) => {
    const query = `DELETE FROM reviews WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

const hasUserReviewedVehicle = async (userId, vehicleId) => {
    const query = `
        SELECT EXISTS(
            SELECT 1 FROM reviews 
            WHERE user_id = $1 AND vehicle_id = $2
        ) as exists
    `;
    const result = await db.query(query, [userId, vehicleId]);
    return result.rows[0].exists;
};

export {
    createReview,
    getReviewsByVehicle,
    getReviewsByUser,
    getReviewById,
    updateReview,
    deleteReview,
    hasUserReviewedVehicle
};
