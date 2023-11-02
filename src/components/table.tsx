type Data = {
  subjectId: number;
  organizationName: string;
  subject: string;
  date: string;
  dateCreated: string;
  status: string;
};
type YourComponentProps = {
  data: Data[];
  tableHeader: string[];
};

export default function Table({ data, tableHeader }: YourComponentProps) {
  return (
    <>
      <table
        id="myTable"
        className="w-full min-w-max border-collapse  border border-black text-center "
      >
        <thead>
          <tr>
            {tableHeader.map((header, index) => (
              <th
                key={index}
                className=" bg-green border-r-0 border-black px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl"
              >
                {header}
              </th>
            ))}
          </tr>
          ;
        </thead>
        <tbody>
          {data.length === 0 ? ( // Check if data is empty
            <tr>
              <td colSpan={6}>No result found</td>
            </tr>
          ) : (
            data.map((data) => (
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
                  {data.dateCreated}
                </td>
                <td className="border border-x-0 border-black  px-2 py-4 text-sm md:text-base">
                  {data.date}
                </td>
                {(data.status === 'Rejected' && (
                  <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#aa0000]">
                    {data.status}
                  </td>
                )) ||
                  (data.status === 'Approved' && (
                    <td className="border border-x-0 border-black px-2 py-4 font-semibold text-[#00aa00]">
                      {data.status}
                    </td>
                  )) ||
                  (data.status === 'For approval' && (
                    <td className="border border-x-0 border-black px-2 py-4 ">{data.status}</td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
