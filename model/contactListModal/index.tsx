import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Can refer to Admin, Doctor, or Patient
    contacts: [
        {
            contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the contacted user
            profileImage: { type: String, required: true }, // Profile image URL
            name: { type: String, required: true } // Name of the contacted user
        }
    ],
});

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
