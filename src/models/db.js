import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.CA_CERT_PATH).toString()
    }
});

const db = {
    query: (text, params) => pool.query(text, params)
};

export default db;