"use client";

import { Button } from "./ui/button";

interface FallbackErrorProps {
  message?: string;
}

export function FallbackError({ message = "Something went wrong!" }: FallbackErrorProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <p className="text-sm">{message}</p>
      <Button onClick={handleRefresh} size='sm'>Refresh</Button>
    </div>
  );
}
