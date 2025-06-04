import React from "react";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Add real ratings

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
};

export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) => {
  return (
    <Link prefetch href={`/library/${id}`}>
      <Card className="bg-white gap-0 overflow-hidden h-full pt-0 shadow-transparent hover:shadow-shadow transition-shadow">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"}
            className="object-cover"
          />
        </div>
        <CardHeader className="flex-1 pt-4">
          <CardTitle className="text-lg font-medium line-clamp-4">{name}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              {tenantImageUrl && (
                <Image
                  alt={tenantSlug}
                  src={tenantImageUrl}
                  width={16}
                  height={16}
                  className="rounded-full border shrink-0 size-[16px]"
                />
              )}
              <p className="text-sm underline font-medium">{tenantSlug}</p>
            </div>
            {reviewCount > 0 && (
              <div className="flex items-center gap-1 mt-4">
                <StarIcon className="size-3.5 fill-black" />
                <p className="text-sm font-medium">
                  {reviewRating} ({reviewCount})
                </p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};
