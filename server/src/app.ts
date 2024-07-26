import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: '*',
        methods: ['*'],
        credentials: true,
    })
);

import userRouter from  './routes/user.routes';

app.use('/api/v1/user', userRouter)


export default app;
