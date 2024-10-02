import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Availability from '@/model/availabilityModal'; // Adjust the path as necessary
import { rescheduleAppointments } from '../../appointments/rescheduleAppointments/route'; // Adjust the path as necessary
import { connectDB } from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        // Parse request body
        const { doctorId, ranges } = await request.json();

        // Validate input
        if (!doctorId || !Array.isArray(ranges) || ranges.length === 0) {
            return NextResponse.json({ message: 'Doctor ID and availability ranges are required' }, { status: 400 });
        }

        // Connect to MongoDB
        await connectDB();

        // Loop through each range to update or create availability
        for (const { startDate, endDate } of ranges) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Check for existing availability that overlaps with the new dates
            const existingAvailability = await Availability.findOne({
                doctorId: new mongoose.Types.ObjectId(doctorId),
                startDate: { $lt: end }, // Existing startDate is before the new endDate
                endDate: { $gt: start }   // Existing endDate is after the new startDate
            });

            if (existingAvailability) {
                // If an overlapping availability exists, update it
                existingAvailability.startDate = start;
                existingAvailability.endDate = end;

                // Call the function to reschedule appointments
                await rescheduleAppointments(doctorId);

                // Save the updated availability document
                await existingAvailability.save();
            } else {
                // If no overlapping availability, create a new one
                const availability = new Availability({
                    doctorId: new mongoose.Types.ObjectId(doctorId),
                    startDate: start,
                    endDate: end
                });

                // Save to the database
                await availability.save();
            }
        }

        return NextResponse.json({ message: 'Availability updated successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error creating/updating availability:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
