import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { ReviewForm } from "./review-form";

interface Props {
  productId: string;
}

export const ReviewSidebar = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data: review } = useSuspenseQuery(trpc.reviews.getOne.queryOptions({
    productId,
  }));

  return (
    <ReviewForm
      productId={productId}
      initialData={review}
    />
  );
};
