import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 *
 * Connects to MongoDB using the connection string from environment variables.
 * Handles connection errors gracefully and provides detailed logging for debugging.
 * If connection fails, the server continues running without database functionality.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Promise that resolves when connection is established or fails
 */
export const connectDB = async (): Promise<void> => {
  try {
    /** MongoDB connection URI from environment variables */
    const mongoURI = process.env.MONGODB_URI;

    // Validate that MongoDB URI is provided
    if (!mongoURI) {
      console.error("MONGODB_URI environment variable is not defined");
      return;
    }

    // Establish connection to MongoDB
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    /**
     * MongoDB Connection Event Handlers
     *
     * These event listeners handle various connection states and provide
     * appropriate logging for monitoring and debugging purposes.
     */

    // Handle connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    // Handle disconnection events
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    /**
     * Connection Error Handling
     *
     * If MongoDB connection fails, log the error but allow the server to continue
     * running. This enables testing of non-database endpoints and provides
     * better development experience when database is temporarily unavailable.
     */
    console.error("Error connecting to MongoDB:", error);
    console.log("Server will continue without database connection");
  }
};

/** Default export for backward compatibility */
export default connectDB;
