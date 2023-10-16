import Head from 'next/head';
import { useState } from 'react';
import NavBar from '~/components/navigation-bar';
import SideBarMenu from '~/components/side-bar-menu';
import UserLogData from '~/components/user-log-data';

export default function UserLog() {
  const [searchInput, setSearchInput] = useState('');

  // Search Bar query
  function searchBar() {
    let i, txtValue;
    const filter = searchInput.toUpperCase();
    const table = document.getElementById('myTable');
    const tr = table.getElementsByTagName('tr');

    // search all it matches
    for (i = 0; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName('td')[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }
  return (
    <>
      {/* HEADER */}
      <Head>
        <title>SD Services MIS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVIGATION BAR */}
      <NavBar showNotificationButton={true} />
      <main className="flex">
        {/* SIDE BAR */}
        <SideBarMenu />

        {/* MAIN CONTENT */}

        <div className="mx-3 mt-4 h-[87vh] w-full overflow-hidden">
          <div className="mx-auto my-0 h-[87vh] max-w-5xl   rounded-3xl px-5 py-5 shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] md:px-9">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Log</h1>
            <div className="my-4 flex flex-col md:my-6 md:flex-row">
              {/* SEARCH */}
              <div className="flex">
                <label
                  htmlFor="search-item"
                  className="flex h-7 w-7  items-center border-[1px]  border-r-0 border-[#2A9134] px-2 md:h-9 md:w-9 lg:h-11 lg:w-11"
                >
                  <img src="search_icon.svg" className="md:h-full " alt="Search Icon" />
                </label>
                <input
                  type="text"
                  name="search"
                  id="search-item"
                  placeholder="Search subject name"
                  className="h-7 border-[1px] border-[#2A9134] px-2 py-1 outline-none md:h-9 md:text-lg lg:h-11 lg:text-xl"
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyUp={searchBar}
                  value={searchInput}
                />
              </div>
              {/* SORT BY DATE */}
              <div className="mt-3 md:ms-5 md:mt-0">
                <select
                  name="sort-date"
                  id="sort-date"
                  className="me-2 h-7 border-[1px] border-[#2A9134] bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
                >
                  <option selected value="" disabled className="text-sm md:text-base">
                    Sort by Date
                  </option>
                  <option value="" className="text-sm md:text-base">
                    Latest
                  </option>
                  <option value="" className="text-sm md:text-base">
                    Old
                  </option>
                </select>

                {/* SORT BY STATUS */}
                <select
                  name="sort-status"
                  id="sort-status"
                  className="h-7 border-[1px] border-[#2A9134] bg-white px-2 py-1 text-sm md:h-9 md:text-base lg:h-11"
                >
                  <option selected value="" disabled className="text-sm md:text-base">
                    Sort by Status
                  </option>
                  <option value="" className="text-sm md:text-base">
                    Pending
                  </option>
                  <option value="" className="text-sm md:text-base">
                    Approved
                  </option>
                  <option value="" className="text-sm md:text-base">
                    Rejected
                  </option>
                </select>
              </div>
            </div>

            <div className="overflow-x-scroll sm:overflow-hidden">
              <table
                id="myTable"
                className="w-full min-w-max border-collapse  border border-black text-center "
              >
                <thead>
                  <tr>
                    <th className=" border-r-0 border-black bg-[#2A9134] px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Subject Id
                    </th>
                    <th className=" border-r-0 border-black bg-[#2A9134] px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Admin
                    </th>
                    <th className=" border-r-0 border-black bg-[#2A9134] px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Subject
                    </th>
                    <th className=" border-r-0 border-black bg-[#2A9134] px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Date
                    </th>
                    <th className=" border-r-0 border-black bg-[#2A9134] px-2 py-2 text-base font-bold tracking-tight text-white md:text-lg lg:text-xl">
                      Status
                    </th>
                  </tr>
                </thead>
                <UserLogData />
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
