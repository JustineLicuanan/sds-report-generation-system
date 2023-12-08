import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { inferRouterOutputs } from '@trpc/server';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';

export default function Calendar({
  date,
}: {
  date: inferRouterOutputs<AppRouter>['admin']['report']['get'];
}) {
  const utils = api.useContext();
  const startDate = new Date(0); // January 1, 1970
  const endDate = new Date();

  const restricted = [
    {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      overlap: false,
      display: 'background',
      color: '#ff9f89',
    },
  ];

  const data = date.map((item) => ({
    id: item.id,
    title: item.createdBy.organizationName,
    start: item.due?.toISOString() ?? '',
  }));

  const events: object = [...restricted, ...data];

  const updateReportMutation = api.admin.report.update.useMutation({
    onSuccess: async () => {
      toast.success('Success');
      await utils.admin.report.get.invalidate({ includeCreatedBy: true });
    },
  });

  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        // themeSystem={''}
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
        height={'70vh'}
        selectable={true}
        select={(info) => {
          alert('selected ' + info.startStr + ' to ' + info.endStr);
        }}
        droppable={true}
        editable={true}
        eventDrop={async (props) =>
          await updateReportMutation.mutateAsync({
            id: props.event.id,
            due: props.event.start?.toISOString(),
          })
        }
        eventClick={() => setShowModal(!showModal)}
        eventBackgroundColor="green"
      />
    </>
  );
}
