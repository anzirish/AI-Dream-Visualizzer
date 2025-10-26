import mongoose, { Document, Schema } from "mongoose";

/**
 * Dream interface extending Mongoose Document
 * Represents a dream entry with AI-generated story and optional image
 */
export interface IDream extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName?: string;
  title: string;
  description: string;
  generatedStory: string;
  generatedImage?: string;
  isPublic: boolean;
  createdAt: Date;
}

const dreamSchema = new Schema<IDream>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    userName: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    generatedStory: {
      type: String,
      required: [true, "Generated story is required"],
    },
    generatedImage: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id; // Match frontend interface
        return ret;
      },
    },
  }
);

// Indexes for better query performance
dreamSchema.index({ userId: 1 });
dreamSchema.index({ isPublic: 1 });
dreamSchema.index({ createdAt: -1 });
dreamSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IDream>("Dream", dreamSchema);