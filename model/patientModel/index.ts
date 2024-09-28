import mongoose from 'mongoose';

// Define the schema for the Patient model
const patientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { 
        type: String, 
        enum: ['male', 'female', 'other'], // Enum for gender
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
export default Patient;
