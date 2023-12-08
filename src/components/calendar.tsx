import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Organization, Report } from '@prisma/client';

export default function Calendar({ date, title }: { date: []; title: Organization[] }) {
  const events = [title, date];

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        buttonIcons={{
          prev: 'chevron-left',
          next: 'chevron-right',
          prevYear: 'chevrons-left', // double chevron
          nextYear: 'chevrons-right', // double chevron
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List',
        }}
        events={events}
        // dateClick={(arg) => alert(arg.dateStr)}
        headerToolbar={{
          start: 'today prev,next', // will normally be on the left. if RTL, will be on the right
          center: 'title',
          end: 'dayGridMonth,dayGridWeek', // will normally be on the right. if RTL, will be on the left
        }}
        height={'50vh'}
        selectable={true}
        select={(info) => {
          alert('selected ' + info.startStr + ' to ' + info.endStr);
        }}
        droppable={true}
      />
    </>
  );
}
