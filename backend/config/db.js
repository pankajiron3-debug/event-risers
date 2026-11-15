import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_risers';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[MongoDB Warning] Server will run in degraded mode. Please verify MongoDB is running or configure MONGO_URI in .env.`);
  }
};

export default connectDB;
