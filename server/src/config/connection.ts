import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks',
	{
		retryWrites: true,
		w: 'majority',
		ssl: true,
	}
);

export default mongoose.connection;
