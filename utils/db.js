import mongoose from "mongoose";
import  dotenv  from "dotenv";

dotenv.config({
    path: ".env",
});
const connectDB = async () => {
  try {
   await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB successfully"));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;