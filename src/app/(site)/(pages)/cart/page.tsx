"use client";

import { useEffect, useState } from "react";
import { getClient } from "@/lib/apolloClient";
import { GET_CART } from "@/graphql/queries/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        // 🔁 Group items by product SKU
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

        const groupedItems = Array.from(groupedMap.values());
        setCartItems(groupedItems);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  if (cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty.</p>;
  }

  return (
    <section className="p-6 max-w-3xl mx-auto pt-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      <ul className="space-y-4 mt-4">
        {cartItems.map((item: any) => {
          const imageUrl = item.product?.small_image?.url?.startsWith("http")
            ? item.product.small_image.url
            : `https://magentodev.winkpayments.io${item.product?.small_image?.url ?? "/placeholder.png"}`;

          const price =
            item.product?.price_range?.minimum_price?.final_price?.value ?? 0;
          const currency =
            item.product?.price_range?.minimum_price?.final_price?.currency ??
            "USD";

          return (
            <li
              key={item.id}
              className="flex gap-4 items-center border p-4 rounded shadow bg-white min-h-[120px] overflow-hidden"
            >
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}

