import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    patientName: { type: String },
    patientPhone: { type: String },
    insuranceNumber: { type: String },
    appointmentType: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'cancelled'], default: 'pending' }
});

let Availability;

try {
    Availability = mongoose.model('Availability');
} catch (error) {
    Availability = mongoose.model('Availability', availabilitySchema);
}

export default Availability;
