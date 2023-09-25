export default function OrganizationAvatar() {
  const organization = [
    { id: 1, name: 'Item 1', imageLink: '' },
    { id: 2, name: 'Item 2', imageLink: '' },
    { id: 3, name: 'Item 3', imageLink: '' },
    { id: 4, name: 'Item 3', imageLink: '' },
    { id: 5, name: 'Item 3', imageLink: '' },
    { id: 6, name: 'Item 3', imageLink: '' },
    { id: 7, name: 'Item 3', imageLink: '' },
    { id: 8, name: 'Item 3', imageLink: '' },
  ];
  return (
    <>
      {organization.map((item) => (
        <div
          key={item.id}
          className="mb-2 me-1 h-20 w-20 rounded-full bg-[#2A9134] md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
        ></div>
      ))}
    </>
  );
}
