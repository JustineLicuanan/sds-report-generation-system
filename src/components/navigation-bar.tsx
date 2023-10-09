export default function NavBar({ showNotificationButton }) {
  return (
    <>
      <nav className="sticky top-0 z-[10] ">
        <div id="nav-container" className="flex justify-between px-3 py-3 md:px-7 md:py-2">
          <div id="titles" className="flex">
            <div id="logo" className="h-10 w-10 rounded-full bg-[#D9D9D9] md:h-12  md:w-12"></div>
            <div className="mt-[-5px] leading-3 text-white">
              <div id="title" className="ms-2 text-xl font-bold  md:text-2xl lg:text-3xl">
                Office of Student Development Services
              </div>
              <div id="sub-title" className="ms-14">
                Report Management System
              </div>
            </div>
          </div>
          {showNotificationButton && (
            <button id="notification">
              <img
                className="h-10 text-black md:h-12"
                src="notification_icon.svg"
                alt="Notification Bell"
              />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
