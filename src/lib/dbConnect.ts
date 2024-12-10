import mongoose from 'mongoose';

let isConnected = false;

export async function dbConnect() {
    if (isConnected) {
        console.log('Reusing existing MongoDB connection');
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
    } catch (error) {
        throw new Error('Failed to connect to MongoDB');
    }
}

export async function dbClose() {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
    }
}
