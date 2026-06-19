import db from '../db.js';

const createServiceRequest = async (userId, vehicleDescription, serviceType, description) => {
    const query = `
        INSERT INTO service_requests (user_id, vehicle_description, service_type, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await db.query(query, [userId, vehicleDescription, serviceType, description]);
    return result.rows[0];
};

const getServiceRequestsByUser = async (userId) => {
    const query = `
        SELECT * FROM service_requests
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const getAllServiceRequests = async () => {
    const query = `
        SELECT 
            service_requests.*,
            users.name AS user_name,
            users.email AS user_email
        FROM service_requests
        INNER JOIN users ON service_requests.user_id = users.id
        ORDER BY service_requests.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getServiceRequestById = async (id) => {
    const query = `
        SELECT 
            service_requests.*,
            users.name AS user_name,
            users.email AS user_email
        FROM service_requests
        INNER JOIN users ON service_requests.user_id = users.id
        WHERE service_requests.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const updateServiceRequestStatus = async (id, status, employeeNotes) => {
    const query = `
        UPDATE service_requests
        SET status = $1, employee_notes = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
    `;
    const result = await db.query(query, [status, employeeNotes, id]);
    return result.rows[0] || null;
};

export { 
    createServiceRequest, 
    getServiceRequestsByUser, 
    getAllServiceRequests,
    getServiceRequestById,
    updateServiceRequestStatus 
};