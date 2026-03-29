// app/api/appointments/rescheduleAppointmentsForEmptyDates/route.ts
import { NextResponse } from 'next/server';
import AppointmentModal, { IAppointment } from '@/model/AppointmentModal';

async function rescheduleAppointmentsForEmptyDates(doctorId: string, removedRanges: { startDate: Date; endDate: Date }[]) {
    const appointments: IAppointment[] = await AppointmentModal.find({ doctorId });

    const appointmentDurations: { [key: string]: number } = {
        'Quick Checkup': 30 * 60 * 1000,
        'Extensive Care': 60 * 60 * 1000,
        'Operation': 2 * 60 * 60 * 1000,
    };

    for (const { startDate, endDate } of removedRanges) {
        for (const appointment of appointments) {
            const appointmentDate = appointment.appointmentTime;

            if (appointmentDate >= startDate && appointmentDate <= endDate) {
                let newDate = new Date(endDate);
                newDate.setDate(newDate.getDate() + 1);
                newDate.setHours(8, 0, 0, 0);

                const duration = appointmentDurations[appointment.appointmentType];

                while (true) {
                    const duplicateAppointment = await AppointmentModal.findOne({
                        doctorId,
                        appointmentTime: { $gte: newDate, $lt: new Date(newDate.getTime() + duration) },
                    });

                    if (duplicateAppointment) {
                        newDate.setMinutes(newDate.getMinutes() + 30);

                        if (newDate.getHours() === 12 && newDate.getMinutes() === 0) {
                            newDate.setHours(13, 0, 0, 0);
                        }

                        if (newDate.getHours() >= 18) {
                            newDate.setDate(newDate.getDate() + 1);
                            newDate.setHours(8, 0, 0, 0);
                        }
                    } else {
                        break;
                    }
                }

                const newEndTime = new Date(newDate.getTime() + duration);

                if (newEndTime.getHours() > 18) {
                    newDate.setDate(newDate.getDate() + 1);
                    newDate.setHours(8, 0, 0, 0);
                }

                await AppointmentModal.findByIdAndUpdate(appointment._id, { appointmentTime: newDate });
                console.log(`Appointment for ${appointment.name} rescheduled to ${newDate}`);
                break;
            }
        }
    }
}

export async function POST(request: Request) {
    try {
        const { doctorId, removedRanges } = await request.json();

        if (!doctorId || !removedRanges) {
            return NextResponse.json({ error: 'doctorId and removedRanges are required' }, { status: 400 });
        }

        await rescheduleAppointmentsForEmptyDates(doctorId, removedRanges);

        return NextResponse.json({ message: 'Appointments rescheduled successfully' });
    } catch (error) {
        console.error('Error rescheduling:', error);
        return NextResponse.json({ error: 'Failed to reschedule' }, { status: 500 });
    }
}