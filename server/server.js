import express from "express";
import dotenv from "dotenv";
import winston from "winston";
import cors from "cors";
import connectDB from "./database/db.js";
import router from "./routes/routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
await connectDB();

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', router);

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
