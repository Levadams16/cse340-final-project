import db from '../db.js';

const createContactMessage = async (name, email, subject, message) => {
    const query = `
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await db.query(query, [name, email, subject, message]);
    return result.rows[0];
};

const getAllContactMessages = async () => {
    const query = `
        SELECT * FROM contact_messages
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const updateContactMessageStatus = async (id, status) => {
    const query = `
        UPDATE contact_messages
        SET status = $1
        WHERE id = $2
        RETURNING *
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0] || null;
};

export { createContactMessage, getAllContactMessages, updateContactMessageStatus };