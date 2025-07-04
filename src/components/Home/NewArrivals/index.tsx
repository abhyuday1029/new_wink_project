"use client";

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const GET_PRODUCTS = gql`
  query {
    products(search: "") {
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

export default function NewArrivals() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Magento Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products.items.map((product: any) => (
          <Link
            key={product.uid}
            href={`/products/${product.url_key}.html`}
            className="border p-4 rounded shadow block hover:shadow-lg transition"
          >
            <img
              src={product.small_image?.url ?? "/placeholder.png"}
              alt={product.name}
              width={150}
              height={150}
              style={{ objectFit: "contain", display: "block", margin: "auto" }}
            />
            <h3 className="text-lg font-semibold mt-2 text-center">{product.name}</h3>
            <p className="text-sm text-center text-gray-700">
              {product.price_range.minimum_price.final_price.currency}{" "}
              {product.price_range.minimum_price.final_price.value}
            </p>
          </Link>
        ))}
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
//             <p className="text-sm text-gray-700">
//               {product.price_range.minimum_price.final_price.currency}{" "}
//               {product.price_range.minimum_price.final_price.value}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
