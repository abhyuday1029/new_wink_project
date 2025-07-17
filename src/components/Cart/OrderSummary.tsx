"use client";

import React from "react";

interface OrderSummaryProps {
  cartItems: any[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      item.product?.price_range?.minimum_price?.final_price?.value ?? 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-white shadow rounded-lg flex flex-col h-[600px]">
        {/* Header */}
        <div className="border-b border-gray-200 py-5 px-6">
          <h3 className="font-semibold text-xl text-gray-800">Order Summary</h3>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto px-6 pt-4 pb-4 flex-1">
          <div className="flex justify-between mb-4 border-b pb-2 text-sm font-medium text-gray-600">
            <span>Product</span>
            <span>Subtotal</span>
          </div>

          {cartItems.map((item) => {
            const product = item.product;
            const price =
              product?.price_range?.minimum_price?.final_price?.value ?? 0;
            const imageUrl = product?.small_image?.url?.startsWith("http")
              ? product?.small_image?.url
              : `https://magentodev.winkpayments.io${product?.small_image?.url ?? ""}`;

            return (
              <div
                key={item.id}
                className="flex items-start justify-between border-b py-3"
              >
                <div className="flex gap-3">
                  <img
                    src={imageUrl}
                    alt={product?.name}
                    className="w-12 h-12 object-contain border rounded"
                  />
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {product?.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  USD {(price * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Sticky bottom */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-lg font-semibold text-gray-800">
              USD {subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => (window.location.href = "/checkout")}
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;