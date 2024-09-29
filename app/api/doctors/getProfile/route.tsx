// pages/api/doctors/getProfile.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/model/doctorModal';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    await connectDB();

    if (!doctorId) {
        return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
    }

    try {
        const doctor = await Doctor.findOne({ doctorId });
        if (!doctor) {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }
        return NextResponse.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor data:', error);
        return handleError(error);
    }
}

// Error handling
function handleError(error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({
        message: 'Internal Server Error',
        error: errorMessage,
    }, { status: 500 });
}
