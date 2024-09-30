import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for Message model
interface IMessage extends Document {
    senderId: string; // The doctor's or client's ID (from session)
    receiverId: string;
    text?: string;
    fileUrl?: string; // Store file URL for images/PDF
    fileType?: string; // Store the type of file (image or pdf)
    createdAt: Date;
}

// Define the schema for messages
const messageSchema: Schema = new Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String },
    fileUrl: { type: String },
    fileType: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
