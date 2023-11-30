import { type Organization } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { paths } from '~/meta';

export default function OrganizationAvatar({ organization }: { organization: Organization[] }) {
  const router = useRouter();
  return (
    <>
      {organization.map((item) => (
        <div
          key={item.id}
          className="group/avatar relative mb-2 me-1 flex h-20 w-20 rounded-full  md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
        >
          <button
            onClick={() => router.push(`${paths.ADMIN}${paths.ORGANIZATIONS}/${item.id}`)}
            className="mb-2 me-1 flex h-20 w-20 rounded-full bg-green  md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
          >
            {/* Your button content */}
          </button>
          <div className="absolute right-0 top-0 z-[4] h-7 w-7 rounded-full bg-yellow text-center ">
            <Image src="/exclamation_icon.svg" alt="Notification Alert" height={100} width={100} />
          </div>

          <div className="group/button absolute bottom-0 right-0 z-[4] hidden h-fit items-center  group-hover/avatar:flex">
            <Link
              href={`${paths.ADMIN}${paths.ORGANIZATIONS}/${item.id}${paths.ORGANIZATION_EDIT}`}
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
          </div>
        </div>
      ))}
    </>
  );
}
