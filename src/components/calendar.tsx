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

  const events: Array = [...restricted, ...data];

  const updateReportMutation = api.admin.report.update.useMutation({
    onSuccess: async () => {
      toast.success('Success');
      await utils.admin.report.get.invalidate({ includeCreatedBy: true });
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

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
        eventClick={(info) => {
          const selected = events.find((event: string) => event.id === info.event.id);
          setSelectedEvent(selected);
          setShowModal(!showModal);
        }}
        eventBackgroundColor="green"
      />
      {showModal && (
        <div
          className={`fixed left-0 top-0 z-[999]  flex h-full w-full items-center  justify-center bg-black/[.50] transition-opacity duration-300 ease-in-out
      `}
        >
          <div
            className={`relative z-[5] h-fit w-[450px]  rounded-3xl bg-white shadow-[0_4px_10px_0px_rgba(0,0,0,0.50)]  duration-300 ease-in-out `}
          >
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Announcement</h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="px-3 py-2">
              <div className="flex  text-xl">
                <h4 className="font-semibold">Date:</h4>
                <div className="ms-1 text-xl font-medium"></div>
              </div>
              <div className="flex py-2 text-xl">
                <h4 className="font-semibold">Organization:</h4>
                <div className="ms-1 text-xl font-medium"></div>
              </div>
            </div>
            <div className="flex justify-end px-4">
              <button
                type="button"
                className="my-4 cursor-pointer rounded-md bg-yellow px-8 py-2 text-lg font-medium"
                onClick={() => setShowModal(!showModal)}
              >
                Mark as complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
