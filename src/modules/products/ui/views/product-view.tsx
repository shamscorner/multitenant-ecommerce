"use client";

import { Fragment, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

// Dynamically import the CartButton component to avoid server-side rendering issues
const CartButton = dynamic(() => import("../components/cart-button").then(mod => mod.CartButton), {
  ssr: false,
  loading: () => <Button disabled variant="reverse" className="flex-1">Add to cart</Button>,
});

// Dynamically import the CartButton component to avoid server-side rendering issues
const RichText = dynamic(() => import("@payloadcms/richtext-lexical/react").then(mod => mod.RichText), {
  loading: () => <div>Loading...</div>,
});

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
};

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(trpc.products.getOne.queryOptions({ id: productId }));

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard not supported in this browser");
      return;
    }

    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link. Please copy manually.");
      });
  };

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={product.cover?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{product.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <Badge className="px-2 py-1 text-base font-medium">
                  {formatCurrency(product.price)}
                </Badge>
              </div>

              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2">
                  {product.tenant.image?.url && (
                    <Image
                      src={product.tenant.image.url}
                      alt={product.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {product.tenant.name}
                  </p>
                </Link>
              </div>

              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={product.reviewRating}
                    iconClassName="size-4"
                  />
                  <p className="text-base font-medium">
                    {product.reviewCount} ratings
                  </p>
                </div>
              </div>
            </div>

            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <StarRating
                  rating={product.reviewRating}
                  iconClassName="size-4"
                />
                <p className="text-base font-medium">
                  {product.reviewCount} ratings
                </p>
              </div>
            </div>

            <div className="p-6">
              {product.description ? (
                <RichText data={product.description} />
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-4">
                  <CartButton
                    isPurchased={product.isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
                  />
                  <Button
                    variant="reverse"
                    className="bg-white"
                    disabled={isCopied}
                    onClick={() => handleCopyLink()}
                  >
                    {isCopied ? <CheckIcon /> : <LinkIcon />}
                    <span className="sr-only">Copy product link</span>
                  </Button>
                </div>

                <p className="text-center font-medium">
                  {product.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${product.refundPolicy} money back guarantee`
                  }
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({product.reviewRating})</p>
                    <p className="text-base">{product.reviewCount} ratings</p>
                  </div>
                </div>
                <div
                  className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4"
                >
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">{stars} {stars === 1 ? "star" : "stars"}</div>
                      <Progress
                        value={product.ratingDistribution[stars] || 0}
                        className="h-[1lh]"
                      />
                      <div className="font-medium">
                        {product.ratingDistribution[stars] || 0}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={"/placeholder.png"}
            alt="Placeholder"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
