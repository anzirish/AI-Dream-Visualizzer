import mongoose, { Document, Schema } from "mongoose";

// Cover document interface
export interface ICover extends Document {
  _id: mongoose.Types.ObjectId;
  url: string;
}

// Cover schema definition
const coverSchema = new Schema<ICover>({
  url: {
    type: String,
    required: [true, "Cover URL is required"],
    trim: true,
  },
});

export default mongoose.model<ICover>("Cover", coverSchema);