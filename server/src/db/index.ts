import mongoose from 'mongoose';
import { DB_NAME } from '../constant';

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `\n 💨 MongoDB connected Successfully, DB HOST => ${connect.connection.host}`
        );
    } catch (error) {
        console.log('\nMongodb connection error =>', error);
        process.exit(1);
    }
};

export default connectDB;
