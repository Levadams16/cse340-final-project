import db from './db.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedDatabase = async () => {
    try {
        const sqlPath = join(__dirname, 'sql', 'schema.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await db.query(sql);
            console.log('Database schema initialized');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export default seedDatabase;