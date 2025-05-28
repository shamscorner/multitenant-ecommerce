import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";

import { getPayload } from "payload";
import configPromise from '@payload-config';
import { Category } from "@/payload-types";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: 'categories',
    depth: 1, // populate subcategories
    pagination: false,
    where: {
      parent: {
        exists: false,
      }
    }
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((subcategory) => ({
      ...(subcategory as Category),
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
