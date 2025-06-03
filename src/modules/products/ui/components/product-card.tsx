import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateTenantURL } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
};

export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) => {
  const router = useRouter();

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenantURL(tenantSlug));
  };

  return (
    <Link href={`/products/${id}`} className="group">
      <Card className="bg-white h-full pt-0 shadow-transparent hover:shadow-shadow transition-shadow">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"}
            className="object-cover"
          />
        </div>
        <CardHeader className="border-y py-4 flex-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="mt-4">
            {/* TODO: Redirect to user shop */}
            <div
              className="flex items-center gap-2"
              onClick={handleUserClick}
              role="button"
              tabIndex={0}
            >
              {tenantImageUrl && (
                <Image
                  alt={tenantSlug}
                  src={tenantImageUrl}
                  width={16}
                  height={16}
                  className="rounded-full object-cover border shrink-0 size-[16px]"
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
        <CardFooter>
          <Badge>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Number(price))}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};
