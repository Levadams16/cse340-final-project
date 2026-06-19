import db from '../db.js';

const emailExists = async (email) => {
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists`;
    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};

const saveUser = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `;
    const result = await db.query(query, [name, email, hashedPassword]);
    return result.rows[0];
};

const getAllUsers = async () => {
    const query = `
        SELECT 
            users.id,
            users.name,
            users.email,
            users.created_at,
            roles.role_name AS "roleName"
        FROM users
        INNER JOIN roles ON users.role_id = roles.id
        ORDER BY users.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getAllRoles = async () => {
    const query = `SELECT * FROM roles ORDER BY id ASC`;
    const result = await db.query(query);
    return result.rows;
};

const updateUserRole = async (userId, roleId) => {
    const query = `
        UPDATE users
        SET role_id = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, email
    `;
    const result = await db.query(query, [roleId, userId]);
    return result.rows[0] || null;
};

const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

export { emailExists, saveUser, getAllUsers, getAllRoles, updateUserRole, deleteUser };