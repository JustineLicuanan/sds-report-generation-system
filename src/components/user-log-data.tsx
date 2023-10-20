export default function UserLogData() {
  const userLogData = [
    {
      subjectId: 2023001,
      admin: 'Admin Name',
      subject: 'Subject 1',
      date: '09/20/23',
      status: 'For approval',
    },
    {
      subjectId: 2023002,
      admin: 'Admin Name',
      subject: 'Subject 2',
      date: '09/21/23',
      status: 'Rejected',
    },
    {
      subjectId: 2023003,
      admin: 'Admin Name',
      subject: 'Subject 3',
      date: '09/22/23',
      status: 'Approved',
    },
  ];
  return (
    <>
      <tbody>
        {userLogData.map((data) => (
          <tr key={data.subjectId} className=" even:bg-[#808080]/20">
            <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
              {data.subjectId}
            </td>
            <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
              {data.admin}
            </td>
            <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
              {data.subject}
            </td>
            <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
              {data.date}
            </td>
            {(data.status === 'Rejected' && (
              <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#FF0000]">
                {data.status}
              </td>
            )) ||
              (data.status === 'Approved' && (
                <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00FF00]">
                  {data.status}
                </td>
              )) ||
              (data.status === 'For approval' && (
                <td className="border border-x-0 border-black px-2 py-4 ">{data.status}</td>
              ))}
          </tr>
        ))}
      </tbody>
    </>
  );
}
