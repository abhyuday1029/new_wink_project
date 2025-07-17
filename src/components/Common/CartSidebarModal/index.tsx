"use client";

import React, { useEffect, useState } from "react";
import { getClient } from "@/lib/apolloClient";
import { GET_CART } from "@/graphql/queries/cart";
import { REMOVE_ITEM_FROM_CART } from "@/graphql/queries/cart";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import EmptyCart from "./EmptyCart";
import Link from "next/link";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  // Fetch cart from Magento
  const fetchCart = async () => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    try {
      const { data } = await getClient().query({
        query: GET_CART,
        variables: { cartId },
        fetchPolicy: "network-only",
      });

      const items = data?.cart?.items || [];
      setCartItems(items);

      // Calculate subtotal
      const total = items.reduce((sum: number, item: any) => {
        const price = item.product?.price_range?.minimum_price?.final_price?.value ?? 0;
        return sum + price * item.quantity;
      }, 0);

      setSubtotal(total);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    if (isCartModalOpen) {
      fetchCart();
    }

    const handleClickOutside = (event: any) => {
      if (!event.target.closest(".modal-content")) {
        closeCartModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartModalOpen]);

  const handleRemoveItem = async (itemId: string) => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;

    try {
      await getClient().mutate({
        mutation: REMOVE_ITEM_FROM_CART,
        variables: {
          cartId,
          cart_item_id: parseInt(itemId, 10),
        },
      });

      fetchCart(); // Refresh cart after removal
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end">
        <div className="w-full max-w-[500px] shadow-1 bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content">
          <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 mb-7.5">
            <h2 className="font-medium text-dark text-lg sm:text-2xl">Cart View</h2>
            <button onClick={closeCartModal} className="text-2xl">×</button>
          </div>

          <div className="h-[66vh] overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-5">
                    <div className="w-full flex items-center gap-4">
                      <img
                        src={
                          item.product?.small_image?.url?.startsWith("http")
                            ? item.product.small_image.url
                            : `https://magentodev.winkpayments.io${item.product?.small_image?.url ?? "/placeholder.png"}`
                        }
                        alt={item.product.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                      <div>
                        <h3 className="font-medium text-dark">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">
                          {item.product.price_range.minimum_price.final_price.currency}{" "}
                          {item.product.price_range.minimum_price.final_price.value}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          <div className="border-t border-gray-3 bg-white pt-5 pb-4 sm:pb-7.5 lg:pb-11 mt-7.5 sticky bottom-0">
            <div className="flex items-center justify-between gap-5 mb-6">
              <p className="font-medium text-xl text-dark">Subtotal:</p>
              <p className="font-medium text-xl text-dark">${subtotal.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                onClick={closeCartModal}
                href="/cart"
                className="w-full flex justify-center font-medium text-white bg-blue py-[13px] px-6 rounded-md hover:bg-blue-dark"
              >
                View Cart
              </Link>

              <Link
                href="/checkout"
                className="w-full flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md hover:bg-opacity-95"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;
