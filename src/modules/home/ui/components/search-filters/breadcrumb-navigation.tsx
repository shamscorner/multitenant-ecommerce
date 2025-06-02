import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface Props {
  activeCategorySlug?: string | null;
  activeCategoryName?: string | null;
  activeSubCategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
  activeCategorySlug,
  activeCategoryName,
  activeSubCategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategorySlug === "all") return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg font-semibold">
        {activeSubCategoryName ? (
          <>
            {activeCategorySlug && (
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="underline">
                  <Link href={`/${encodeURIComponent(activeCategorySlug)}`}>{activeCategoryName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>
                {activeSubCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ): (
          <BreadcrumbItem>
            <BreadcrumbPage>
              {activeCategoryName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
