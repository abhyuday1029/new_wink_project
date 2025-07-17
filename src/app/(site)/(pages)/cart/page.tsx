"use client";

import { useEffect, useState } from "react";
import { getClient } from "@/lib/apolloClient";
import { GET_CART } from "@/graphql/queries/cart";
import { gql } from "@apollo/client";
import OrderSummary from "@/components/Cart/OrderSummary";

const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($cartId: String!, $cart_item_id: Int!) {
    removeItemFromCart(input: {
      cart_id: $cartId,
      cart_item_id: $cart_item_id
    }) {
      cart {
        items {
          id
        }
      }
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartId: String!, $cart_item_id: Int!, $quantity: Float!) {
    updateCartItems(input: {
      cart_id: $cartId,
      cart_items: [
        {
          cart_item_id: $cart_item_id,
          quantity: $quantity
        }
      ]
    }) {
      cart {
        items {
          id
          quantity
        }
      }
    }
  }
`;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await getClient().query({
        query: GET_CART,
        variables: { cartId },
        fetchPolicy: "network-only",
      });

      const items = data?.cart?.items || [];
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartItemId: number) => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    try {
      await getClient().mutate({
        mutation: REMOVE_ITEM_FROM_CART,
        variables: { cartId, cart_item_id: cartItemId },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    if (newQuantity < 1) {
      return handleRemove(cartItemId);
    }

    try {
      await getClient().mutate({
        mutation: UPDATE_CART_ITEM,
        variables: { cartId, cart_item_id: cartItemId, quantity: newQuantity * 1.0 },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  if (cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty.</p>;
  }

  return (
    <section className="pt-32 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cart Items */}
        <ul className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => {
            const imageUrl = item.product?.small_image?.url?.startsWith("http")
              ? item.product.small_image.url
              : `https://magentodev.winkpayments.io${item.product?.small_image?.url ?? "/placeholder.png"}`;

            const price = item.product?.price_range?.minimum_price?.final_price?.value ?? 0;
            const currency = item.product?.price_range?.minimum_price?.final_price?.currency ?? "USD";
            const subtotal = (item.quantity * price).toFixed(2);

            return (
              <li
                key={item.id}
                className="flex justify-between items-center border p-4 rounded shadow bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                    <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                    <p className="font-medium">{currency} {price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-24 text-right font-semibold">{currency} {subtotal}</p>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Right: Order Summary */}
        <div className="sticky top-32 h-fit">
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </section>
  );
}
