"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

interface Props {
  slug: string;
};

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data: tenant } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
          {tenant.image?.url && (
            <Image
              src={tenant.image.url}
              width={32}
              height={32}
              className="rounded-full object-cover border shrink-0 size-[32px]"
              alt={slug}
            />
          )}
          <p className="text-xl">{tenant.name}</p>
        </Link>
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div />
        {/* TODO: Skeleton for checkout button */}
      </div>
    </nav>
  );
};
