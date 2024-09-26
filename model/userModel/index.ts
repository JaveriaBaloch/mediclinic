import { Schema, model, models, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  profileImage: string; // URL of the profile image
  role: string;
  certificates?: string[]; // Array of certificate URLs
  labReports?: string[]; // Array of lab report URLs
  prescriptions?: string[]; // Array of prescription URLs
  insuranceCards?: string[]; // Array of insurance card URLs
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String }, // Store S3 image URL
  role: { type: String, required: true, default: 'user' },
  certificates: { type: [String], default: [] }, // Optional array of URLs
  labReports: { type: [String], default: [] },
  prescriptions: { type: [String], default: [] },
  insuranceCards: { type: [String], default: [] },
});

const UserModel = models.User || model<IUser>('User', UserSchema);

export default UserModel;
