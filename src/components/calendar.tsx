import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

export default function Calendar() {
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
        events={[
          { title: 'Sample Event 1', date: '2023-11-01' },
          { title: 'Sample Event 2', date: '2023-11-02' },
        ]}
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
        editable={true}
      />
    </>
  );
}
