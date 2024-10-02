// models/Availability.js (or .ts)
import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Doctor',
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
});

const Availability = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);

export default Availability;
