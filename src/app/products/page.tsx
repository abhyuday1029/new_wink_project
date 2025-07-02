"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/graphql/queries/getProducts";

export default function ProductsPage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: {
      search: "", // Required by Magento 2
      pageSize: 12,
      currentPage: 1,
    },
  });

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Failed to load products: {error.message}</p>;

  const products = data?.products?.items || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Magento Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => {
          const imageUrl =
            product?.small_image?.url || "/placeholder.png";
          const price =
            product?.price_range?.minimum_price?.final_price?.value;
          const currency =
            product?.price_range?.minimum_price?.final_price?.currency;

          return (
            <div
              key={product.uid || product.id || product.sku}
              className="border rounded p-4 shadow-sm text-center"
            >
              <img
                src={imageUrl}
                alt={product.name}
                width={150}
                height={150}
                style={{ objectFit: "contain", display: "block", margin: "0 auto" }}
              />
              <h3 className="text-base font-semibold mt-4">{product.name}</h3>
              <p className="text-sm text-gray-700 mt-1">
                {price !== undefined
                  ? `${currency} $${price.toFixed(2)}`
                  : "Price Unavailable"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
