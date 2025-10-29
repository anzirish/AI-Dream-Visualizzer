import mongoose, { Document, Schema } from "mongoose";

/**
 * Cover Document Interface
 *
 * Simple interface for cover images with only _id and url properties.
 *
 * @interface ICover
 * @extends {Document}
 */
export interface ICover extends Document {
  /** MongoDB ObjectId for the cover */
  _id: mongoose.Types.ObjectId;

  /** URL of the cover image */
  url: string;
}

/**
 * Cover Schema Definition
 *
 * Simple schema for cover images with only url field.
 */
const coverSchema = new Schema<ICover>({
  /** Cover image URL */
  url: {
    type: String,
    required: [true, "Cover URL is required"],
    trim: true,
  },
});

/** Export the Cover model */
export default mongoose.model<ICover>("Cover", coverSchema);