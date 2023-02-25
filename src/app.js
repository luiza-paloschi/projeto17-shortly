import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js';
import urlsRouter from './routes/urlsRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use([authRouter, urlsRouter]);

app.listen(process.env.PORT, () => console.log('O servidor está rodando'));