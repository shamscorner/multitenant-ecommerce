"use client";

import { TriangleAlertIcon } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
       <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlertIcon />
        <p className="text-base font-medium text-center max-w-xl mx-auto">
          This product is not available for purchase at the moment. Please try again later or contact support for assistance. You can check other products in the meantime.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
