// "use client";

// import React from "react";
// import { useQuery } from "@apollo/client";
// import { GET_PRODUCTS } from "@/graphql/queries/getProducts";

// export default function ProductsPage() {
//   const { data, loading, error } = useQuery(GET_PRODUCTS, {
//     variables: {
//       search: "",
//       pageSize: 12,
//       currentPage: 1,
//     },
//   });

//   if (loading) return <p>Loading products...</p>;
//   if (error) return <p>Failed to load products: {error.message}</p>;

//   const products = data?.products?.items || [];

//   console.log("Products data:", products); // Debug log

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Magento Products</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product) => {
//           const imageUrl = product?.small_image?.url || "/placeholder.png";
//           const priceValue = product?.price_range?.minimum_price?.regular_price?.value;
//           const currency = product?.price_range?.minimum_price?.regular_price?.currency;

//           return (
//             <div
//               key={product.uid || product.sku}
//               className="border rounded p-4 shadow-sm text-center"
//             >
//               <img
//                 src={imageUrl}
//                 alt={product.name}
//                 width={150}
//                 height={150}
//                 style={{ objectFit: "contain", display: "block", margin: "0 auto" }}
//               />
//               <h3 className="text-base font-semibold mt-4">{product.name}</h3>
//               <p className="text-sm text-gray-700 mt-1">
//                 {priceValue !== undefined && currency
//                   ? `${currency} $${priceValue.toFixed(2)}`
//                   : "Price Unavailable"}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import { gql, useQuery } from "@apollo/client";

const GET_PRODUCTS = gql`
  query {
    products(search: "") {
      items {
        uid
        sku
        name
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
    }
  }
`;

export default function NewArrivals() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Magento Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products.items.map((product: any) => (
          <div key={product.uid} className="border p-4 rounded shadow">
            <img
              src={product.small_image?.url ?? "/placeholder.png"}
              alt={product.name}
              width={150}
              height={150}
              style={{ objectFit: "contain", display: "block", margin: "auto" }}
            />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-sm text-gray-700">
              {product.price_range.minimum_price.final_price.currency}{" "}
              {product.price_range.minimum_price.final_price.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
