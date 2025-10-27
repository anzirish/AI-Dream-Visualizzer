import mongoose, { Document, Schema } from "mongoose";

/**
 * Dream Document Interface
 *
 * Extends Mongoose Document to provide type safety for dream operations.
 * Represents a user's dream entry with AI-generated story and optional image,
 * including privacy settings for community sharing.
 *
 * @interface IDream
 * @extends {Document}
 */
export interface IDream extends Document {
  /** MongoDB ObjectId for the dream entry */
  _id: mongoose.Types.ObjectId;

  /** Reference to the user who created this dream */
  userId: mongoose.Types.ObjectId;

  /** Cached username for display purposes (optional) */
  userName?: string;

  /** User-provided title for the dream */
  title: string;

  /** User's description of their dream experience */
  description: string;

  /** AI-generated story based on the dream description */
  generatedStory: string;

  /** AI-generated image in base64 format (optional) */
  generatedImage?: string;

  /** Whether this dream is visible in the public community feed */
  isPublic: boolean;

  /** Dream creation timestamp */
  createdAt: Date;
}

/**
 * Dream Schema Definition
 *
 * Mongoose schema that defines the structure and validation rules for dream documents.
 * Includes relationships to users, content validation, and privacy controls.
 */
const dreamSchema = new Schema<IDream>(
  {
    /** Reference to the user who owns this dream */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: [true, "User ID is required"],
    },

    /** Cached username for efficient display without population */
    userName: {
      type: String,
      trim: true, // Remove leading/trailing whitespace
    },

    /** Dream title with length validation */
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true, // Remove leading/trailing whitespace
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    /** User's dream description with length validation */
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true, // Remove leading/trailing whitespace
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    /** AI-generated story content (required) */
    generatedStory: {
      type: String,
      required: [true, "Generated story is required"],
    },

    /** AI-generated image in base64 format (optional) */
    generatedImage: {
      type: String,
      default: null, // No image by default
    },

    /** Privacy setting for community visibility */
    isPublic: {
      type: Boolean,
      default: false, // Private by default for user privacy
    },
  },
  {
    /** Enable automatic createdAt and updatedAt timestamps */
    timestamps: true,
  }
);

/**
 * Database Indexes for Query Optimization
 *
 * Strategic indexes to improve query performance for common access patterns:
 * - userId: Fast lookup of user's dreams
 * - isPublic: Efficient filtering of public dreams for community feed
 * - createdAt: Chronological sorting (newest first)
 * - userId + createdAt: Compound index for user's dreams sorted by date
 */
dreamSchema.index({ userId: 1 }); // User's dreams lookup
dreamSchema.index({ isPublic: 1 }); // Public dreams filtering
dreamSchema.index({ createdAt: -1 }); // Chronological sorting
dreamSchema.index({ userId: 1, createdAt: -1 }); // User's dreams by date

/** Export the Dream model for use throughout the application */
export default mongoose.model<IDream>("Dream", dreamSchema);
