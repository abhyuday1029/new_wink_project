"use client";

import { useEffect, useState } from "react";
import { getClient } from "@/lib/apolloClient";
import { GET_CART } from "@/graphql/queries/cart";
import { gql } from "@apollo/client";

const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($cartId: String!, $cart_item_id: Int!) {
    removeItemFromCart(input: {
      cart_id: $cartId,
      cart_item_id: $cart_item_id
    }) {
      cart {
        items {
          id
          product {
            name
            sku
            small_image {
              url
            }
            price_range {
              minimum_price {
                final_price {
                  value
                  currency
                }
              }
            }
          }
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
      console.warn("No cart_id found in localStorage");
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

      // Group by SKU
      const groupedMap = new Map();
      for (const item of items) {
        const key = item.product.sku;
        if (groupedMap.has(key)) {
          const existing = groupedMap.get(key);
          existing.quantity += item.quantity;
        } else {
          groupedMap.set(key, { ...item });
        }
      }

      setCartItems(Array.from(groupedMap.values()));
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
        variables: {
          cartId,
          cart_item_id: cartItemId,
        },
      });

      // Refresh cart after removal
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  if (cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty.</p>;
  }

  return (
    <section className="p-6 max-w-3xl mx-auto pt-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      <ul className="space-y-4 mt-4">
        {cartItems.map((item) => {
          const imageUrl = item.product?.small_image?.url?.startsWith("http")
            ? item.product.small_image.url
            : `https://magentodev.winkpayments.io${item.product?.small_image?.url ?? "/placeholder.png"}`;

          const price =
            item.product?.price_range?.minimum_price?.final_price?.value ?? 0;
          const currency =
            item.product?.price_range?.minimum_price?.final_price?.currency ?? "USD";

          return (
            <li
              key={item.id}
              className="flex justify-between items-center gap-4 border p-4 rounded shadow bg-white"
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
                  <p className="mt-1 font-medium">
                    {currency} {price}
                  </p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="px-3 py-1 border border-red-500 text-red-600 hover:bg-red-100 rounded text-sm"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
