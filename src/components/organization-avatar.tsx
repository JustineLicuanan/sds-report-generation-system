import Link from 'next/link';

export default function OrganizationAvatar({ organization }) {
  return (
    <>
      {organization.map((item) => (
        <Link
          href={{
            pathname: '/organization-request',
            query: {
              organizationName: item.name,
              categoryName: item.category,
            },
          }}
          key={item.id}
          className="group/avatar relative mb-2 me-1 flex h-20 w-20 rounded-full bg-[#2A9134]  md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
        >
          <div className="group/button absolute right-0 top-0  hidden h-fit items-center  group-hover/avatar:flex">
            <Link
              href={{
                pathname: '/edit-info',
                query: {
                  organizationName: item.name,
                  categoryName: item.category,
                  email: item.email,
                  description: item.description,
                },
              }}
              // Set showEditInfo to true when button is clicked
              type="button"
              className="rounded-full bg-[#f7b205] "
            >
              <img src="edit_info_icon.svg" alt="Edit Info" className="h-7" />
            </Link>

            <div className="absolute z-[1] ms-8 hidden whitespace-nowrap rounded-md bg-[#D9D9D9] px-2 py-1 group-hover/button:block">
              Edit Info
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
