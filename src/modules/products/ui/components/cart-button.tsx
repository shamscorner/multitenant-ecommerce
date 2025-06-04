import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
};

export const CartButton = ({ tenantSlug, productId, }: Props) => {
  const cart = useCart(tenantSlug);
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
