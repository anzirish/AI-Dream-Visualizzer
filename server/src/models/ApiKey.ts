import mongoose, { Document, Schema } from "mongoose";

/**
 * API Key Document Interface
 *
 * Extends Mongoose Document to provide type safety for API key operations.
 * Represents a community-contributed API key for AI services with usage
 * tracking, contributor attribution, and activation status.
 *
 * @interface IApiKey
 * @extends {Document}
 */
export interface IApiKey extends Document {
  /** Type of AI service this key provides access to */
  keyType: "openrouter" | "stable_diffusion";

  /** The actual API key string (stored securely) */
  apiKey: string;

  /** Reference to the user who contributed this key */
  contributedBy: mongoose.Types.ObjectId;

  /** Number of times this key has been used */
  usageCount: number;

  /** Whether this key is currently active and available for use */
  isActive: boolean;

  /** When this key was added to the system */
  createdAt: Date;

  /** Last time this key was used for an API call */
  lastUsedAt?: Date;
}

/**
 * API Key Schema Definition
 *
 * Mongoose schema that defines the structure and validation rules for API key documents.
 * Includes service type validation, contributor tracking, and usage monitoring.
 */
const ApiKeySchema: Schema = new Schema(
  {
    /** AI service type with strict validation */
    keyType: {
      type: String,
      required: true,
      enum: ["openrouter", "stable_diffusion"], // Only allow these service types
    },

    /** The API key string (should be encrypted in production) */
    apiKey: {
      type: String,
      required: true,
    },

    /** Reference to the contributing user */
    contributedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },

    /** Usage tracking counter */
    usageCount: {
      type: Number,
      default: 0, // Start with zero usage
    },

    /** Activation status for key management */
    isActive: {
      type: Boolean,
      default: true, // New keys are active by default
    },

    /** Last usage timestamp for monitoring */
    lastUsedAt: {
      type: Date,
      // Optional field, set when key is first used
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
 * Strategic indexes to improve query performance for API key management:
 * - keyType + isActive: Fast lookup of available keys by service type
 * - usageCount: Efficient sorting for load balancing (least used first)
 */
ApiKeySchema.index({ keyType: 1, isActive: 1 }); // Service type + status lookup
ApiKeySchema.index({ usageCount: 1 }); // Usage-based sorting for load balancing

/** Export the ApiKey model for use throughout the application */
export const ApiKey = mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
