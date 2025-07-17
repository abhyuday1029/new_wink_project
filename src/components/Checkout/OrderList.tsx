"use client";
import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_CART = gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      items {
        id
        quantity
        product {
          name
        }
        prices {
          row_total {
            value
          }
        }
      }
      prices {
        grand_total {
          value
        }
      }
    }
  }
`;

const OrderList = () => {
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("cart_id");
    if (id) setCartId(id);
  }, []);

  const { data, loading, error } = useQuery(GET_CART, {
    variables: { cartId: cartId || "" },
    skip: !cartId,
    fetchPolicy: "network-only",
  });

  const cartItems = data?.cart?.items || [];
  const grandTotal = data?.cart?.prices?.grand_total?.value || 0;

  if (loading) return <p className="p-4 text-sm text-gray-500">Loading order items...</p>;
  if (error) return <p className="p-4 text-sm text-red-500">Error loading cart.</p>;

  return (
    <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
      <div className="flex items-center justify-between py-5 border-b border-gray-3">
        <h4 className="font-medium text-dark">Product</h4>
        <h4 className="font-medium text-dark text-right">Subtotal</h4>
      </div>

      {cartItems.length === 0 ? (
        <p className="py-6 text-sm text-gray-500">No items in cart.</p>
      ) : (
        cartItems.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-5 border-b border-gray-3"
          >
            <p className="text-dark">
              {item.product.name} × {item.quantity}
            </p>
            <p className="text-dark text-right">
              ${item.prices.row_total.value.toFixed(2)}
            </p>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div className="flex items-center justify-between pt-5">
          <p className="font-medium text-lg text-dark">Total</p>
          <p className="font-medium text-lg text-dark text-right">
            ${grandTotal.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderList;