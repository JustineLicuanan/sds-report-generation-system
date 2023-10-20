type LogData = {
  subjectId: number;
  organizationName: string;
  subject: string;
  date: string;
  status: string;
};

export default function LogData({ logData }: { logData: LogData[] }) {
  return (
    <>
      <tbody>
        {logData.map((data) => (
          <tr key={data.subjectId} className=" even:bg-[#808080]/20">
            <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
              {data.subjectId}
            </td>
            <td className="border border-x-0 border-black px-2 py-4 text-sm md:text-base">
              {data.organizationName}
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
