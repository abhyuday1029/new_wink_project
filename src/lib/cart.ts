import { getClient } from "@/lib/apolloClient";
import { CREATE_CART, ADD_TO_CART } from "@/graphql/queries/cart";

// Utility to get or create a cart ID
export async function getOrCreateCart(): Promise<string> {
  let cartId = typeof window !== "undefined" ? localStorage.getItem("cart_id") : null;

  if (cartId) return cartId;

  const client = getClient();
  const { data } = await client.mutate({ mutation: CREATE_CART });

  cartId = data?.createEmptyCart;
  if (cartId && typeof window !== "undefined") {
    localStorage.setItem("cart_id", cartId);
  }

  return cartId;
}

// Utility to add a product to the cart
export async function addToCart(productSku: string, quantity = 1) {
  const cartId = await getOrCreateCart();
  const client = getClient();

  const cartItems = [
    {
      data: {
        sku: productSku,
        quantity: quantity,
      },
    },
  ];

  try {
    const { data, errors } = await client.mutate({
      mutation: ADD_TO_CART,
      variables: { cartId, cartItems },
    });

    if (errors && errors.length > 0) {
      console.error("Magento GraphQL errors:", errors);
      throw new Error(errors[0].message);
    }

    if (!data || !data.addSimpleProductsToCart) {
      console.error("Unexpected Magento response:", data);
      throw new Error("Invalid response from Magento.");
    }

    return data.addSimpleProductsToCart.cart.items;
  } catch (error: any) {
    console.error("Add to cart failed:", error.message || error);
    throw error;
  }
}

