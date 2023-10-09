export default function CreateOrganization() {
  return (
    <>
      {/* CREATE ORGANIZATION */}
      <div className=" z-2 fixed left-0 top-0 flex  h-full w-full items-center justify-center  bg-black/[.50]">
        <div className="relative h-[433px] w-[450px] rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] ">
          <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
            Create new Organization
          </h1>
          <div className="h-[1px] w-full bg-black "></div>

          <div className="px-10 py-5">
            <label htmlFor="organization-name" className=" text-xl font-medium ">
              Organization Name
            </label>
            <br />
            <input
              type="text"
              name="organization-name"
              id="organization-name"
              className="mb-2 mt-1 h-9 border-[1px] border-[#2A9134] px-2  py-1 text-lg outline-none "
            />
            <br />
            <label htmlFor="org-category" className="text-xl font-medium">
              Category
            </label>
            <br />
            <select
              name="category"
              id="org-category"
              className="mt-1 h-9 border-[1px] border-[#2A9134] bg-transparent px-2 py-1  text-lg outline-none"
            >
              <option selected value="" disabled>
                Select a category
              </option>
              <option value="">Student Governing Body</option>
              <option value="">Academic Organization</option>
              <option value="">Non Academic Organization</option>
            </select>
          </div>
          <div className="h-[1px] w-full bg-black "></div>
          <div className="px-10 pt-5">
            <div className="mb-6 font-bold">
              NOTE:{'   '}
              <span className="font-normal">
                Please provide the existing CVSU email address that you would like to grant
                permission to.
              </span>
            </div>
            <label htmlFor="email-address" className=" text-xl font-medium">
              Email
            </label>
            <br />
            <input
              type="text"
              name="email-address"
              id="email-address"
              className=" mt-1 h-9 border-[1px] border-[#2A9134] px-2  py-1 text-lg outline-none"
            />{' '}
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* UPLOAD ORGANIZATION LOGO */}
        <div className=" z-2 fixed left-0 top-0 flex  h-full w-full items-center justify-center  ">
          <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] ">
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">
              Upload Organization Logo
            </h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="align-center mt-[30px] flex  justify-center px-10">
              <img src="default-logo.png" alt="Avatar Logo" className="h-[200px] w-[200px]" />
            </div>
            <div className="flex justify-center">
              <label
                htmlFor="avatar-logo"
                className="my-6 cursor-pointer rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium  "
              >
                Upload
              </label>
              <input type="file" name="avatar" id="avatar-logo" className="hidden" />
            </div>
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                className="my-6 cursor-pointer rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Back
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* LAST STEP */}
        <div className=" z-2 fixed left-0 top-0 flex  h-full w-full items-center justify-center  ">
          <div className="relative h-[433px] w-[450px]  rounded-3xl bg-white shadow-[0_4px_25px_0px_rgba(0,0,0,0.25)] ">
            <h1 className="py-3 text-center text-3xl font-bold tracking-tight">Last step</h1>
            <div className="h-[1px] w-full bg-black "></div>
            <div className="mt-5 flex flex-col px-10">
              <label htmlFor="org-description" className=" mb-2 text-xl font-medium">
                Description
              </label>
              <textarea
                name="organization-description"
                id="org-description"
                placeholder="Tell me about this organization"
                cols="30"
                rows="7"
                className="border border-[#2A9134] px-2 py-1 text-lg"
              ></textarea>
            </div>
            <div className="absolute bottom-0 left-7">
              <button
                type="button"
                className="my-6 cursor-pointer rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Back
              </button>
            </div>
            <div className="absolute bottom-0 right-7">
              <button
                type="button"
                className="my-6 rounded-md bg-[#f7b205] px-8 py-2 text-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CLOSE MODAL */}
      <div className="absolute right-2 top-16 cursor-pointer text-3xl font-black">X</div>
    </>
  );
}
