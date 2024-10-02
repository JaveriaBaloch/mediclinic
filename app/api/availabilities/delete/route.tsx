import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Availability from '@/model/availabilityModal'; // Adjust the path as necessary
import { connectDB } from '@/lib/mongodb';
import { rescheduleAppointmentsForEmptyDates } from '../../appointments/rescheduleForEmptyDates/route';

export async function DELETE(request: Request) {
    try {
        // Get the URL and extract the ID from query parameters
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        // Validate input
        if (!id) {
            return NextResponse.json(
                { message: 'ID is required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectDB();

        // Find the availability record by ID
        const availability = await Availability.findById(id);
        if (!availability) {
            return NextResponse.json(
                { message: 'Availability not found' },
                { status: 404 }
            );
        }

        const { doctorId } = availability;

        // Delete the availability record
        await Availability.deleteOne({ _id: id });

        // Call the function to reschedule appointments with the removed range
        await rescheduleAppointmentsForEmptyDates(doctorId, [availability]);

        return NextResponse.json(
            { message: 'Availability removed successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error removing availability:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
