"use client";

import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import { addToCart } from "@/lib/cart";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ Use this instead of props

const GET_PRODUCT_BY_URL_KEY = gql`
  query GetProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        sku
        name
        url_key
        description {
          html
        }
        price_range {
          minimum_price {
            final_price {
              value
              currency
            }
          }
        }
        image {
          url
          label
        }
      }
    }
  }
`;

export default function ProductPage() {
  const params = useParams(); // ✅ Correct way in a client component
  const raw = params?.url_key as string;
  const cleanKey = raw?.endsWith(".html") ? raw.replace(/\.html$/, "") : raw;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = getClient();
        const { data } = await client.query({
          query: GET_PRODUCT_BY_URL_KEY,
          variables: { urlKey: cleanKey },
        });

        setProduct(data?.products?.items?.[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (cleanKey) {
      fetchData();
    }
  }, [cleanKey]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const imageUrl = product.image?.url?.startsWith("http")
    ? product.image.url
    : `https://magentodev.winkpayments.io${product.image?.url ?? "/placeholder.png"}`;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product.sku, 1);
      alert(`Added ${product.name} to cart!`);
    } catch (e) {
      alert("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="p-6 mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <Image
        src={imageUrl}
        alt={product.image?.label || product.name}
        width={400}
        height={400}
        className="mt-4 mx-auto"
        unoptimized
      />
      <div
        className="mt-4 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: product.description?.html ?? "" }}
      />
      <p className="mt-6 text-xl">
        Price:{" "}
        <strong>
          {product.price_range.minimum_price.final_price.currency}{" "}
          {product.price_range.minimum_price.final_price.value}
        </strong>
      </p>
      <p className="mt-2 text-sm">SKU: {product.sku}</p>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-6"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </main>
  );
}



// import { gql } from "@apollo/client";
// import { getClient } from "@/lib/apolloClient";
// import Image from "next/image";

// const GET_PRODUCT_BY_URL_KEY = gql`
//   query GetProductByUrlKey($urlKey: String) {
//     products(filter: { url_key: { eq: $urlKey } }) {
//       items {
//         id
//         name
//         sku
//         url_key
//         description {
//           html
//         }
//         price_range {
//           minimum_price {
//             final_price {
//               value
//               currency
//             }
//             regular_price {
//               value
//               currency
//             }
//           }
//         }
//         image {
//           url
//           label
//         }
//       }
//     }
//   }
// `;

// type Params = {
//   params: {
//     url_key: string;
//   };
// };

// export default async function ProductDetailPage({ params }: Params) {
//   const client = getClient();
//   const { data } = await client.query({
//     query: GET_PRODUCT_BY_URL_KEY,
//     variables: { urlKey: params.url_key.replace(".html", "") },
//   });

//   const product = data.products.items[0];

//   if (!product) return <div className="p-10 text-center">Product not found</div>;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
//       {/* Product Image */}
//       <div className="w-full">
//         <Image
//           src={`https://magentodev.winkpayments.io${product.image.url}`}
//           alt={product.image.label || product.name}
//           width={600}
//           height={600}
//           className="w-full h-auto object-contain rounded-md shadow"
//         />
//       </div>

//       {/* Product Info */}
//       <div className="flex flex-col gap-4">
//         <h1 className="text-3xl font-bold">{product.name}</h1>

//         {/* Placeholder for ratings & reviews */}
//         <div className="text-yellow-400 text-lg flex gap-1">
//           ★★★☆☆
//           <span className="text-sm text-blue-600 underline ml-2 cursor-pointer">
//             3 Reviews
//           </span>
//         </div>

//         {/* Pricing */}
//         <div className="text-xl">
//           <p>
//             As low as:{" "}
//             <span className="font-bold">
//               {product.price_range.minimum_price.final_price.currency}{" "}
//               {product.price_range.minimum_price.final_price.value}
//             </span>
//           </p>
//           <p className="text-sm text-gray-500">
//             Excl. Tax:{" "}
//             <strong>
//               {product.price_range.minimum_price.final_price.currency}{" "}
//               {product.price_range.minimum_price.final_price.value}
//             </strong>
//           </p>
//         </div>

//         {/* Description */}
//         <div
//           className="prose prose-sm text-gray-800 max-w-none"
//           dangerouslySetInnerHTML={{ __html: product.description.html }}
//         />

//         {/* Stock & SKU */}
//         <div className="flex justify-between text-sm text-gray-600 mt-4">
//           <p className="text-green-700 font-medium">IN STOCK</p>
//           <p>SKU#: {product.sku}</p>
//         </div>

//         {/* Size/Color (UI only – no data binding here) */}
//         <div className="mt-6">
//           <label className="block font-semibold mb-2">Size</label>
//           <div className="flex gap-2">
//             {[28, 29, 30, 31, 32].map((size) => (
//               <button
//                 key={size}
//                 className="border px-3 py-1 rounded hover:bg-gray-100 text-sm"
//               >
//                 {size}
//               </button>
//             ))}
//           </div>

//           <label className="block font-semibold mt-4 mb-2">Color</label>
//           <div className="flex gap-2">
//             {["green", "fuchsia", "red"].map((color) => (
//               <div
//                 key={color}
//                 className={`w-6 h-6 rounded-full border-2 cursor-pointer`}
//                 style={{ backgroundColor: color }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Qty & Add to Cart */}
//         <div className="mt-6 flex items-center gap-4">
//           <input
//             type="number"
//             min={1}
//             defaultValue={1}
//             className="w-16 border px-2 py-1 text-center rounded"
//           />
//           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
