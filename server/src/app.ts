import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const allowedHost = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: allowedHost,
        methods: ['GET', 'POST','PATCH','DELETE','PUT'],
        credentials: true,
    })
);

import userRouter from  './routes/user.routes';
import urlRouter from './routes/url.routes';

app.use('/api/v1/user', userRouter)


app.use('/api/v1/url',urlRouter )

app.use(errorHandler);
export default app;
