import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import apiRoutes from './routes'; // <-- Import main router

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes); // <-- Use main router

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});