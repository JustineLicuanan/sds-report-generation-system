import { type Organization } from '@prisma/client';
import { PenSquare } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { paths } from '~/meta';

export default function OrganizationAvatar({ organization }: { organization: Organization[] }) {
  const router = useRouter();

  return (
    <>
      {organization.map((item) => (
        <Link
          href={`${paths.ADMIN}${paths.ORGANIZATIONS}/${item.id}`}
          key={item.id}
          className="rounded-sm border border-input p-4 hover:bg-gray/40"
        >
          <div className="z-2 flex w-full justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(
                  `${paths.ADMIN}${paths.ORGANIZATIONS}/${item.id}${paths.ORGANIZATION_EDIT}`
                );
              }}
              className="rounded-full p-1 hover:bg-yellow active:scale-95"
            >
              <PenSquare className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-between">
            <div className="group/avatar relative mb-2 me-1 flex h-20 w-20 rounded-full">
              {item?.imageId ? (
                <div className="mb-2 me-1 flex h-20 w-20 rounded-full bg-green">
                  <CldImage
                    width="100"
                    height="100"
                    src={`/${item.imageId}`}
                    alt="Organization Logo"
                    className="h-20 w-20 rounded-full bg-green"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-green"></div>
              )}

              {/* <div className="absolute right-0 top-0 z-[4] h-7 w-7 rounded-full bg-yellow text-center ">
              <Image
                src="/exclamation_icon.svg"
                alt="Notification Alert"
                height={100}
                width={100}
              />
            </div> */}

              {/* <div className="group/button absolute bottom-0 right-0 z-[4] hidden h-fit items-center  group-hover/avatar:flex">
              <Link
                href={``}
                className="rounded-full bg-gray "
              >
                <Image
                  src="/profile_info_icon.svg"
                  alt="Edit Info"
                  height={100}
                  width={100}
                  className="h-7 w-fit"
                />
              </Link>
              <div className="absolute z-[1] ms-8 hidden whitespace-nowrap rounded-md bg-gray px-2 py-1 group-hover/button:block">
                Profile Info
              </div> 
            </div>*/}
            </div>
          </div>
          <div className="text-center font-bold">{item.name}</div>
        </Link>
      ))}
    </>
  );
}
