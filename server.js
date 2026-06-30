import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

import { startSessionCleanup } from './src/utils/session-cleanup.js';
import { addLocalVariables } from './src/middleware/global.js';
import flash from './src/middleware/flash.js';
import seedDatabase from './src/models/setup.js';
import router from './src/controllers/routes.js';

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

const pgSession = connectPgSimple(session);

app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL,
            ssl: {
                rejectUnauthorized: true,
                ca: fs.readFileSync(process.env.CA_CERT_PATH).toString()
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

startSessionCleanup();
seedDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(addLocalVariables);
app.use(flash);
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});