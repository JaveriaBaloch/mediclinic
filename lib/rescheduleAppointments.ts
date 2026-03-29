// app/api/appointments/rescheduleAppointments/route.ts
import { NextResponse } from 'next/server';
import Availability from '@/model/availabilityModal';
import AppointmentModal, { IAppointment } from '@/model/AppointmentModal';

export async function rescheduleAppointments(doctorId: string) {
    const availabilityRecords = await Availability.find({ doctorId }).sort({ startDate: 1 });

    if (availabilityRecords.length === 0) {
        console.log('No availability records found.');
        return;
    }

    const vacationDates = availabilityRecords.map(record => ({
        startDate: record.startDate,
        endDate: record.endDate,
    }));

    const appointments: IAppointment[] = await AppointmentModal.find({ doctorId });

    const appointmentDurations: { [key: string]: number } = {
        'Quick Checkup': 30 * 60 * 1000,
        'Extensive Care': 60 * 60 * 1000,
        'Operation': 2 * 60 * 60 * 1000,
    };

    for (const appointment of appointments) {
        const appointmentDate = appointment.appointmentTime;

        for (const { startDate, endDate } of vacationDates) {
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












