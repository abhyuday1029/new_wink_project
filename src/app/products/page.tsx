"use client";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

const GET_PRODUCT_BY_URL_KEY = gql`
  query GetProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        uid
        sku
        name
        url_key
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

export default function ProductDetail() {
  const { url_key } = useParams();
  const cleanUrlKey = typeof url_key === "string" ? url_key.replace(/\.html$/, "") : "";

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_URL_KEY, {
    variables: { urlKey: cleanUrlKey },
    skip: !cleanUrlKey,
  });

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product: {error.message}</p>;
  if (!data?.products?.items?.length) return <p>Product not found</p>;

  const product = data.products.items[0];

  return (
    <section className="p-6">
      <div className="border p-4 rounded shadow max-w-lg mx-auto">
        <img
          src={product.small_image?.url ?? "/placeholder.png"}
          alt={product.name}
          width={300}
          height={300}
          style={{ objectFit: "contain", display: "block", margin: "auto" }}
        />
        <h3 className="text-2xl font-bold mt-4">{product.name}</h3>
        <p className="text-lg text-gray-700 mt-2">
          {product.price_range.minimum_price.final_price.currency}{" "}
          {product.price_range.minimum_price.final_price.value}
        </p>
        <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
      </div>
    </section>
  );
}



// "use client";

// import { gql, useQuery } from "@apollo/client";

// const GET_PRODUCTS = gql`
//   query {
//     products(search: "") {
//       items {
//         uid
//         sku
//         name
//         small_image {
//           url
//         }
//         price_range {
//           minimum_price {
//             final_price {
//               value
//               currency
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export default function NewArrivals() {
//   const { data, loading, error } = useQuery(GET_PRODUCTS);

//   if (loading) return <p>Loading products...</p>;
//   if (error) return <p>Error loading products: {error.message}</p>;

//   return (
//     <section className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Magento Products</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {data.products.items.map((product: any) => (
//           <div key={product.uid} className="border p-4 rounded shadow">
//             <img
//               src={product.small_image?.url ?? "/placeholder.png"}
//               alt={product.name}
//               width={150}
//               height={150}
//               style={{ objectFit: "contain", display: "block", margin: "auto" }}
//             />
//             <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
//             <p className="text-sm text-black-700">
//               {product.price_range.minimum_price.final_price.currency}{" "}
//               {product.price_range.minimum_price.final_price.value}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
