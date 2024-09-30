import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Doctor model
export interface IDoctor extends Document {
    doctorId: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    profileImage: string; // S3 URL
    documents: string[];  // Array of S3 URLs
    status: 'pending' | 'accepted' | 'rejected';  // Enum type for status
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for the Doctor model
const doctorSchema: Schema = new Schema(
    {
        doctorId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        specialty: { type: String, required: true },
        phone: { type: String, required: true },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            match: /.+\@.+\..+/ // Basic email validation
        },
        profileImage: { type: String },  // S3 URL for the profile image
        documents: { type: [String] },   // Array of S3 URLs for uploaded documents
        status: { 
            type: String, 
            default: 'pending', 
            enum: ['pending', 'accepted', 'rejected'] 
        },
    },
    { 
        timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
    }
);

// Create or retrieve the Doctor model
const Doctor = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', doctorSchema);

export default Doctor;
