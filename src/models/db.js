import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

export const caCert = process.env.CA_CERT || '';

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const db = {
    query: (text, params) => pool.query(text, params)
};

export default db;