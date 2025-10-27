import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Document Interface
 *
 * Extends Mongoose Document to provide type safety for user operations.
 * Represents a registered user in the AI Dreams application with authentication
 * capabilities and profile information.
 *
 * @interface IUser
 * @extends {Document}
 */
export interface IUser extends Document {
  /** MongoDB ObjectId for the user */
  _id: mongoose.Types.ObjectId;

  /** User's email address (unique identifier) */
  email: string;

  /** Hashed password (excluded from queries by default) */
  password: string;

  /** User's display name */
  name: string;

  /** Account creation timestamp */
  createdAt: Date;

  /**
   * Compare provided password with stored hash
   *
   * Uses bcrypt to securely compare a plain text password with the stored
   * hashed password. This method is used during authentication to verify
   * user credentials without exposing the actual password.
   *
   * @param candidatePassword - Plain text password to verify
   * @returns Promise that resolves to true if passwords match, false otherwise
   *
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema Definition
 *
 * Mongoose schema that defines the structure and validation rules for user documents.
 * Includes field validation, indexing, and security configurations.
 */
const userSchema = new Schema<IUser>(
  {
    /** Email field with validation and uniqueness constraint */
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true, // Automatically convert to lowercase
      trim: true, // Remove whitespace
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },

    /** Password field with security configurations */
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude password from queries by default for security
    },

    /** User display name with length validation */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Remove leading/trailing whitespace
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
  },
  {
    /** Enable automatic createdAt and updatedAt timestamps */
    timestamps: true,
  }
);

/**
 * Database Indexes
 *
 * Create unique index on email field for fast lookups and to enforce uniqueness.
 * This prevents duplicate user accounts and improves query performance.
 */
userSchema.index({ email: 1 }, { unique: true });

/**
 * Pre-save Middleware: Password Hashing
 *
 * Automatically hashes the password before saving to database using bcrypt.
 * Only hashes if the password field has been modified to avoid unnecessary
 * processing on other field updates.
 *
 * @param next - Mongoose middleware next function
 */
userSchema.pre("save", async function (next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified("password")) return next();

  try {
    // Generate salt with cost factor of 12 for security
    const salt = await bcrypt.genSalt(12);

    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance Method: Password Comparison
 *
 * Compares a plain text password with the stored hashed password.
 * Used during authentication to verify user credentials securely.
 *
 * @param candidatePassword - Plain text password to verify
 * @returns Promise resolving to boolean indicating if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/** Export the User model for use throughout the application */
export default mongoose.model<IUser>("User", userSchema);
