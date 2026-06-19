import db from '../db.js';

const getAllVehicles = async () => {
    const query = `
        SELECT 
            vehicles.*,
            categories.name AS category_name
        FROM vehicles
        LEFT JOIN categories ON vehicles.category_id = categories.id
        WHERE vehicles.is_available = true
        ORDER BY vehicles.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getVehiclesByCategory = async (categoryName) => {
    const query = `
        SELECT 
            vehicles.*,
            categories.name AS category_name
        FROM vehicles
        LEFT JOIN categories ON vehicles.category_id = categories.id
        WHERE vehicles.is_available = true AND categories.name = $1
        ORDER BY vehicles.created_at DESC
    `;
    const result = await db.query(query, [categoryName]);
    return result.rows;
};

const getVehicleById = async (id) => {
    const query = `
        SELECT 
            vehicles.*,
            categories.name AS category_name
        FROM vehicles
        LEFT JOIN categories ON vehicles.category_id = categories.id
        WHERE vehicles.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const getVehicleImages = async (vehicleId) => {
    const query = `
        SELECT * FROM vehicle_images
        WHERE vehicle_id = $1
        ORDER BY is_primary DESC, id ASC
    `;
    const result = await db.query(query, [vehicleId]);
    return result.rows;
};

const getAllCategories = async () => {
    const query = `SELECT * FROM categories ORDER BY name ASC`;
    const result = await db.query(query);
    return result.rows;
};

export { 
    getAllVehicles, 
    getVehiclesByCategory, 
    getVehicleById, 
    getVehicleImages,
    getAllCategories 
};