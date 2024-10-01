import { connectDB } from "@/lib/mongodb";
import AppointmentModal from "@/model/AppointmentModal";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id'); // Use get() to retrieve the ID

    await connectDB(); // Connect to MongoDB

    try {
        // Check if the appointment ID is provided
        if (!id) {
            return NextResponse.json({ message: 'Appointment ID is required' }, { status: 400 }); // 400 Bad Request
        }

        // Find the appointment by ID and delete it
        const appointment = await AppointmentModal.findByIdAndDelete(id);
        if (!appointment) {
            return NextResponse.json({ message: 'Appointment not found' }, { status: 404 }); // 404 Not Found
        }

        return NextResponse.json({ success: true, message: 'Appointment canceled successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        return NextResponse.json({ message: 'Error canceling appointment', error: error.message }, { status: 500 });
    }
}
