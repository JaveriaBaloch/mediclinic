import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  specialization: string;
  speciality: string;
  doctorId: string;
  patientId: string; // Add patientId field
  insuranceNumber: string;
  name: string;
  phone: string;
  appointmentType: string;
  date: Date;
  appointmentTime: Date;
  imageUrl?: string; // Optional field for the image URL
}

const AppointmentSchema: Schema = new Schema({
  doctorId: { type: String, required: true },
  patientId: { type: String, required: true },
  insuranceNumber: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  appointmentType: { type: String, required: true },
  date: { type: Date, required: true },
  appointmentTime: { type: Date, required: true },
  imageUrl: { type: String, required: true }, // Ensure this field exists

}, {
  timestamps: true,
});

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
