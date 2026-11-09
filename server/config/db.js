import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const connected = await mongoose.connect(process.env.MONGODB_URI);

    if(connected) {
        console.log("MongoDB Connected....");
    } else {
        console.log("MongoDB Failed to connect....")
    }
};

export default connectDB;