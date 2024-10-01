import mongoose, { Document, Schema, Model } from 'mongoose';

interface IVacation extends Document {
    doctorId: string;
    startDate: Date;
    endDate: Date;
}

const vacationSchema = new Schema<IVacation>({
    doctorId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

// Check if the model is already defined, and return it
const Vacation: Model<IVacation> = mongoose.models.Vacation || mongoose.model<IVacation>('Vacation', vacationSchema);
export default Vacation;
