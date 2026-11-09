import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL
}));

const PORT = process.env.PORT || 3000;

const serverStart = async () => {
    try {
        await connectDB();
        app.listen(`Server started on port: http://localhost:${PORT}`);
    } catch (error) {
        console.error(error.message);
    }
};

serverStart();