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

const getAllVehiclesAdmin = async () => {
    const query = `
        SELECT 
            vehicles.*,
            categories.name AS category_name
        FROM vehicles
        LEFT JOIN categories ON vehicles.category_id = categories.id
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

const createVehicle = async ({ make, model, year, price, mileage, color, description, categoryId }) => {
    const query = `
        INSERT INTO vehicles (make, model, year, price, mileage, color, description, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const result = await db.query(query, [make, model, year, price, mileage, color, description, categoryId]);
    return result.rows[0];
};

const updateVehicle = async (id, { make, model, year, price, mileage, color, description, categoryId, isAvailable }) => {
    const query = `
        UPDATE vehicles
        SET 
            make = $1,
            model = $2,
            year = $3,
            price = $4,
            mileage = $5,
            color = $6,
            description = $7,
            category_id = $8,
            is_available = $9,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
    `;
    const result = await db.query(query, [make, model, year, price, mileage, color, description, categoryId, isAvailable, id]);
    return result.rows[0] || null;
};

const deleteVehicle = async (id) => {
    const query = `DELETE FROM vehicles WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

export { 
    getAllVehicles,
    getAllVehiclesAdmin,
    getVehiclesByCategory, 
    getVehicleById, 
    getVehicleImages,
    getAllCategories,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
