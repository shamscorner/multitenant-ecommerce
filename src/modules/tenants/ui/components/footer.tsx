import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export const Footer = () => {
  return (
    <footer className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center h-full gap-2 px-4 py-6 lg:px-12">
        <p>Powered by</p>
        <Link
          href={process.env.NEXT_PUBLIC_APP_URL || "/"}
          title="Go to homepage"
          aria-label="Go to homepage"
        >
          <span className={cn("text-2xl font-semibold", poppins.className)}>
            shamsroad
          </span>
        </Link>
      </div>
    </footer>
  );
};
