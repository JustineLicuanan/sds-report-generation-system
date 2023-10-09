import Link from 'next/link';

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
          className="group/avatar relative mb-2 me-1 flex h-20 w-20 rounded-full bg-[#2A9134]  md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
        >
          <div className="group/button absolute right-0 top-0  hidden h-fit items-center  group-hover/avatar:flex">
            <button type="button" className=" rounded-full bg-[#f7b205] ">
              <img src="edit_info_icon.svg" alt="Edit Info" className="h-7" />
            </button>
            <Link
              href="#"
              className="absolute z-[1] ms-8 hidden whitespace-nowrap rounded-md bg-[#D9D9D9] px-2 py-1 hover:bg-[#f7b205] group-hover/button:block"
            >
              Edit Info
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}