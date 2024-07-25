import 'dotenv/config';
import connectDB from './db';
import app from './app';

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n ⚙ Server is listening on ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('MngoDB Error: ', error);
    });
