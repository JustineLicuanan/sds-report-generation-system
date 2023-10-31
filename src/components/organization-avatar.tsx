import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { paths } from '~/meta';

export default function OrganizationAvatar({ organization }: { organization: User[] }) {
  const router = useRouter();

  return (
    <>
      {organization.map((item) => (
        <div
          key={item.id}
          className="group/avatar relative mb-2 me-1 flex h-20 w-20 rounded-full bg-[#2A9134]  md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
        >
          <button
            onClick={() => router.push(`${paths.ADMIN}/${paths.ORGANIZATION_REPORTS}/${item.id}/`)}
            className="mb-2 me-1 flex h-20 w-20 rounded-full bg-[#2A9134]  md:mb-3 md:h-24 md:w-24 lg:h-28 lg:w-28"
          >
            {/* Your button content */}
          </button>
          <div className="group/button absolute right-0 top-0 z-[4] hidden h-fit items-center  group-hover/avatar:flex">
            <Link
              href={{
                pathname: `${paths.ADMIN}/organizations/id123/edit`,
                query: {
                  organizationName: item.name,
                  categoryName: item.category,
                  email: item.email,
                  description: item.description,
                },
              }}
              className="rounded-full bg-[#f7b205] "
            >
              <Image
                src="/edit_info_icon.svg"
                alt="Edit Info"
                height={100}
                width={100}
                className="h-7 w-fit"
              />
            </Link>
            <div className="absolute z-[1] ms-8 hidden whitespace-nowrap rounded-md bg-[#D9D9D9] px-2 py-1 group-hover/button:block">
              Edit Info
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
