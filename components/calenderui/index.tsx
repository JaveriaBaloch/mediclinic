import React, { useEffect, useState } from 'react';
import './style.scss';

const CalendarScheduler: React.FC = () => {
  const [currentTimeSlot, setCurrentTimeSlot] = useState<string | null>(null);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    // Generate days of the week based on today's date
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startOfWeek = today.getDate() - today.getDay(); // Get Sunday as the start of the week
    const days = dayNames.slice(0, 7).map((day, index) => {
      const date = new Date(today);
      date.setDate(startOfWeek + index);
      return `${day} ${date.getDate()}/${date.getMonth() + 1}`;
    });
    setDaysOfWeek(days);

    // Generate time slots
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) { // From 9 AM to 5 PM
      slots.push(`${hour}:00 AM`);
      if (hour < 12) {
        slots.push(`${hour}:30 AM`);
      } else if (hour < 17) {
        slots.push(`${hour - 12}:00 PM`);
        slots.push(`${hour - 12}:30 PM`);
      }
    }
    setTimeSlots(slots);

    // Set the current time slot
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const formattedCurrentTime = `${currentHour % 12 === 0 ? 12 : currentHour % 12}:${currentMinute < 10 ? '0' : ''}${currentMinute} ${currentHour < 12 ? 'AM' : 'PM'}`;
      setCurrentTimeSlot(formattedCurrentTime);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calendar-scheduler mt-5">
      <h2>Weekly Calendar</h2>
      <div className="calendar-grid">
        <div className="header">
          <div className="empty-cell"></div>
          {daysOfWeek.map((day) => (
            <div className="day-header" key={day}>
              {day}
            </div>
          ))}
        </div>
        {timeSlots.map((time) => (
          <div className="time-slot" key={time}>
            <div className="time-label">{time}</div>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`calendar-cell ${currentTimeSlot === time ? 'current-time-slot' : ''}`}
              >
                {/* Optionally, you can display appointment info here */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarScheduler;
