import mongoose, { Document, Model } from 'mongoose';

// Define the interface for a Patient document
interface IPatient extends Document {
    patientId: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: Date;
    phone: string;
    email: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    emergencyContact: {
        name: string;
        relation: string;
        phone: string;
    };
    insuranceProvider: {
        name: string;
        policyNumber: string;
        coverage: string;
    };
    medicalHistory: {
        condition: string;
        dateDiagnosed: Date;
        notes: string;
    }[];
    profileImage: string; // New field for profile image
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema
const PatientSchema = new mongoose.Schema<IPatient>({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { 
        type: String, 
        enum: ['male', 'female', 'other'],
        required: true 
    },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
    emergencyContact: {
        name: { type: String, required: true },
        relation: { type: String, required: true },
        phone: { type: String, required: true },
    },
    insuranceProvider: {
        name: { type: String, required: true },
        policyNumber: { type: String, required: true },
        coverage: { type: String, required: true },
    },
    medicalHistory: [{
        condition: { type: String },
        dateDiagnosed: { type: Date },
        notes: { type: String }
    }],
    profileImage: { type: String }, // New field for profile image
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create the Patient model or use the existing one
const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
