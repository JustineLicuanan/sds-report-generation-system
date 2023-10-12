import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CreateOrganization from './create-organization';

export default function SideBarMenu() {
  const sidebarMenu = [
    { id: 1, name: 'Home', imageLink: 'home_icon.svg', urlLink: '/' },
    { id: 2, name: 'Log', imageLink: 'log_icon.svg', urlLink: '/log' },
    { id: 3, name: 'Create', imageLink: 'create_icon.svg', urlLink: '' },
  ];

  const { asPath } = useRouter(); // Get the current route
  const [createOrganization, setCreateOrganization] = useState(false);

  const toggleCreateComponent = () => {
    setCreateOrganization(!createOrganization);
  };

  return (
    <>
      <div
        id="side-bar"
        className="sticky top-20 z-[1] my-4 ml-3 h-[87vh] w-16 bg-[#2A9134] p-1 md:w-16"
      >
        {sidebarMenu.map((item) => (
          <Link
            href={item.urlLink}
            key={item.id}
            onClick={() => {
              if (item.urlLink === '') {
                toggleCreateComponent(); // Toggle the component visibility
              }
            }}
            className={`group relative m-1 mb-2 flex h-12 w-12 items-center justify-center rounded-md  hover:bg-[#f7b205] md:mx-1 ${
              asPath === item.urlLink ? 'bg-[#f7b205]' : 'bg-[#D9D9D9]' // Check if the current route matches the item's urlLink
            }`}
          >
            <img src={item.imageLink} alt={item.name} className="h-12" />
            <div className="absolute left-16 hidden rounded-md bg-[#D9D9D9] px-2 py-1 text-left text-xl font-medium group-hover:block">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
      {createOrganization && <CreateOrganization />}
    </>
  );
}

{
  /* 
  
      <button
          type="button"
          className="group/create relative m-1 mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-[#D9D9D9] hover:bg-[#f7b205]  
            md:mx-1"
          onClick={}
        >
          <img src="create_icon.svg" alt="Create" className="h-12" />
          <div className=" absolute left-16 hidden  rounded-md bg-[#D9D9D9] px-2 py-1 text-left text-xl font-medium group-hover/create:block">
            Create
          </div>
        </button> */
}
