import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.MONGOOSE_URL);
    console.log(`Mongoose connected to DB : ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error during connected to DB : ${error.message}`);
    process.exit(1);
  }
}
