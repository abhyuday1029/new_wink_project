// import Image from "next/image";
// import { gql } from "@apollo/client";
// import { getClient } from "@/lib/apolloClient";

// const GET_PRODUCT_BY_URL_KEY = gql`
//   query GetProductByUrlKey($urlKey: String!) {
//     products(filter: { url_key: { eq: $urlKey } }) {
//       items {
//         uid
//         sku
//         name
//         url_key
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

// export default async function ProductDetailPage({
//   params,
// }: {
//   params: { url_key: string };
// }) {
//   const urlKey = params?.url_key || "";
// const cleanUrlKey = decodeURIComponent(urlKey).replace(/\.html$/, "");


//   const { data } = await getClient().query({
//     query: GET_PRODUCT_BY_URL_KEY,
//     variables: { urlKey: cleanUrlKey },
//   });

//   const product = data?.products?.items?.[0];
//   if (!product) return <p>Product not found</p>;

//   const imageUrl =
//     product?.small_image?.url
//       ? product.small_image.url.startsWith("http")
//         ? product.small_image.url
//         : `https://magentodev.winkpayments.io${product.small_image.url}`
//       : "/placeholder.png";

//   return (
//     <section className="p-6">
//       <div className="border p-4 rounded shadow max-w-lg mx-auto text-center">
//         <Image
//           src={imageUrl}
//           alt={product.name}
//           width={400}
//           height={400}
//           style={{ objectFit: "contain", display: "block", margin: "auto" }}
//           unoptimized
//         />
//         <h3 className="text-2xl font-bold mt-4">{product.name}</h3>
//         <p className="text-lg text-gray-700 mt-2">
//           {product.price_range.minimum_price.final_price.currency}{" "}
//           {product.price_range.minimum_price.final_price.value}
//         </p>
//         <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
//       </div>
//     </section>
//   );
// }




import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import React from "react";

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

export default async function ProductDetailPage({
  params,
}: {
  params: { url_key: string };
}) {
  const cleanUrlKey = decodeURIComponent(params.url_key).replace(/\.html$/, "");

  const { data } = await getClient().query({
    query: GET_PRODUCT_BY_URL_KEY,
    variables: { urlKey: cleanUrlKey },
  });

  const product = data?.products?.items?.[0];

  if (!product) return <p>Product not found</p>;

  const imageUrl = product.small_image?.url?.startsWith("http")
    ? product.small_image.url
    : `https://magentodev.winkpayments.io${product.small_image?.url ?? "/placeholder.png"}`;

  return (
    <section className="p-6">
      <div className="border p-4 rounded shadow max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">{product.name}</h1>
        <img
          src={imageUrl}
          alt={product.name}
          width={300}
          height={300}
          className="mx-auto"
          style={{ objectFit: "contain" }}
        />
        <div className="text-center mt-4">
          <p className="text-lg">
            Price:{" "}
            <span className="font-semibold">
              {product.price_range.minimum_price.final_price.currency}{" "}
              {product.price_range.minimum_price.final_price.value}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>

          <button
            onClick={() => alert(`Added ${product.name} to cart!`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-6"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

