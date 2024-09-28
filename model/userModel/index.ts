import { Schema, model, models, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  profileImage: string; // URL of the profile image
  role: string;
}

const UserSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    minlength: [3, 'Username must be at least 3 characters long'], 
    maxlength: [50, 'Username cannot be more than 50 characters long'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long'] 
  },
  profileImage: { type: String }, // Store S3 image URL
  role: { type: String, required: true, default: 'patient' }
}, { collection: 'users' });

const UserModel = models.Users || model<IUser>('Users', UserSchema);

export default UserModel;
