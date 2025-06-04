import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
};

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        asChild
        variant="reverse"
        className="flex-1 font-medium bg-white"
      >
        <Link prefetch href={`/library/${productId}`}>
          View in Library
        </Link>
      </Button>
    );
  }

  const isInCart = cart.isProductInCart(productId);

  return (
    <Button
      variant="reverse"
      className={cn("flex-1", isInCart && "bg-white")}
      onClick={() => cart.toggleProduct(productId)}
    >
      {isInCart
        ? "Remove from cart"
        : "Add to cart"
      }
    </Button>
  );
};
