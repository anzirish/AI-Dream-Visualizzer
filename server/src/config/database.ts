import mongoose from "mongoose";

// Establishes connection to MongoDB database
export const connectDB = async (): Promise<void> => {
  try {
    // MongoDB connection URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    // Validate that MongoDB URI is provided
    if (!mongoURI) {
      console.error("MONGODB_URI environment variable is not defined");
      return;
    }

    // Establish connection to MongoDB
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    // Handle disconnection events
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    // If MongoDB connection fails, log the error but allow the server to continue running
    console.error("Error connecting to MongoDB:", error);
    console.log("Server will continue without database connection");
  }
};

// Default export for backward compatibility
export default connectDB;
