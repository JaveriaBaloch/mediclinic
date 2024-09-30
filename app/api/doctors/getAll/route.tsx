import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/model/doctorModal';

export async function GET() {
    await connectDB();

    try {
        // Fetch all doctors
        const doctors = await Doctor.find({});
        return NextResponse.json(doctors, { status: 200 });
    } catch (error) {
        console.error('Error fetching doctor data:', error);
        return handleError(error);
    }
}

// Error handling function
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
