// //src/app/products/[url_key]/page.tsx
// "use client";

// import { gql } from "@apollo/client";
// import { getClient } from "@/lib/apolloClient";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { addToCart } from "@/lib/cart";

// const GET_PRODUCT_BY_URL_KEY = gql`
//   query GetProductByUrlKey($urlKey: String!) {
//     products(filter: { url_key: { eq: $urlKey } }) {
//       items {
//         __typename
//         uid
//         sku
//         name
//         url_key
//         small_image {
//           url
//         }
//         description {
//           html
//         }
//         price_range {
//           minimum_price {
//             final_price {
//               value
//               currency
//             }
//           }
//         }
//         ... on ConfigurableProduct {
//           configurable_options {
//             attribute_id
//             attribute_code
//             label
//             values {
//               value_index
//               label
//             }
//           }
//           variants {
//             product {
//               sku
//             }
//             attributes {
//               code
//               value_index
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export default function ProductDetailPage() {
//   const params = useParams();
//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

//   const cleanUrlKey =
//     typeof params?.url_key === "string"
//       ? decodeURIComponent(params.url_key).replace(/\.html$/, "")
//       : "";

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await getClient().query({
//           query: GET_PRODUCT_BY_URL_KEY,
//           variables: { urlKey: cleanUrlKey },
//         });
//         setProduct(data?.products?.items?.[0]);
//       } catch (err: any) {
//         setError("Failed to load product.");
//         console.error(err);
//       }
//       setLoading(false);
//     };

//     if (cleanUrlKey) {
//       fetchProduct();
//     }
//   }, [cleanUrlKey]);

//   const isConfigurable = product?.__typename === "ConfigurableProduct";

//   const imageUrl = product?.small_image?.url?.startsWith("http")
//     ? product.small_image.url
//     : `https://magentodev.winkpayments.io${product?.small_image?.url ?? "/placeholder.png"}`;

//   const handleOptionChange = (code: string, value: string) => {
//     setSelectedOptions((prev) => ({ ...prev, [code]: value }));
//   };

//   const getSelectedVariantSku = () => {
//     if (!isConfigurable) return product?.sku;

//     const match = product.variants.find((variant: any) =>
//       variant.attributes.every(
//         (attr: any) => selectedOptions[attr.code] === String(attr.value_index)
//       )
//     );

//     return match?.product?.sku || null;
//   };

//   const handleAddToCart = async () => {
//   const skuToAdd = getSelectedVariantSku();

//   if (!skuToAdd) {
//     alert("Please select all options.");
//     return;
//   }

//   const configurableAttributes = isConfigurable
//     ? product.configurable_options
//         .map((opt: any) => {
//           const value = selectedOptions[opt.attribute_code];
//           if (!value) return null;
//           return {
//             code: opt.attribute_code,
//             value_index: parseInt(value, 10),
//           };
//         })
//         .filter(Boolean)
//     : [];

//   if (
//     isConfigurable &&
//     configurableAttributes.length !== product.configurable_options.length
//   ) {
//     alert("Please select all required options.");
//     return;
//   }
//   console.log("🛍️ Attempting to add to cart:", {
//       skuToAdd,
//       productType: product.__typename,
//       parentSku: product.sku,
//       configurableAttributes
//     });

//   setAdding(true);
//   try {
//     await addToCart(
//       skuToAdd,
//       1,
//       product.__typename,
//       isConfigurable ? product.sku : undefined,
//       configurableAttributes
//     );
//     alert("Added to cart!");
//   } catch (e: any) {
//     console.error("Add to cart failed:", e);
//     alert("Failed to add to cart: " + e.message);
//   } finally {
//     setAdding(false);
//   }
// };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <section className="p-6">
//       <div className="border p-4 rounded shadow max-w-xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-4">{product.name}</h1>
//         <img
//           src={imageUrl}
//           alt={product.name}
//           width={300}
//           height={300}
//           className="mx-auto"
//           style={{ objectFit: "contain" }}
//         />
//         <div
//           className="prose mt-4"
//           dangerouslySetInnerHTML={{ __html: product.description?.html ?? "" }}
//         />
//         <p className="text-lg mt-4 text-center">
//           Price:{" "}
//           <span className="font-semibold">
//             {product.price_range.minimum_price.final_price.currency}{" "}
//             {product.price_range.minimum_price.final_price.value}
//           </span>
//         </p>

//         {isConfigurable && (
//           <div className="mt-4">
//             {product.configurable_options.map((option: any) => (
//               <div key={option.attribute_code} className="mt-2">
//                 <label className="block font-medium mb-1">{option.label}</label>
//                 <select
//                   className="border px-2 py-1 rounded w-full"
//                   onChange={(e) => handleOptionChange(option.attribute_code, e.target.value)}
//                   defaultValue=""
//                 >
//                   <option value="" disabled>
//                     -- Select {option.label} --
//                   </option>
//                   {option.values.map((val: any) => (
//                     <option key={val.value_index} value={val.value_index}>
//                       {val.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="text-center">
//           <button
//             onClick={handleAddToCart}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-6"
//             disabled={adding}
//           >
//             {adding ? "Adding..." : "Add to Cart"}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { addToCart } from "@/lib/cart";

const GET_PRODUCT_BY_URL_KEY = gql`
  query GetProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        __typename
        uid
        sku
        name
        url_key
        small_image {
          url
        }
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
        ... on ConfigurableProduct {
          configurable_options {
            attribute_id
            attribute_code
            label
            values {
              value_index
              label
            }
          }
          variants {
            product {
              sku
            }
            attributes {
              code
              value_index
            }
          }
        }
      }
    }
  }
`;

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const cleanUrlKey =
    typeof params?.url_key === "string"
      ? decodeURIComponent(params.url_key).replace(/\.html$/, "")
      : "";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getClient().query({
          query: GET_PRODUCT_BY_URL_KEY,
          variables: { urlKey: cleanUrlKey },
        });
        setProduct(data?.products?.items?.[0]);
      } catch (err: any) {
        setError("Failed to load product.");
      }
      setLoading(false);
    };

    if (cleanUrlKey) fetchProduct();
  }, [cleanUrlKey]);

  const isConfigurable = product?.__typename === "ConfigurableProduct";

  const handleOptionChange = (code: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [code]: value }));
  };

  const getSelectedVariantSku = () => {
    if (!isConfigurable) return product?.sku;

    const match = product.variants.find((variant: any) =>
      variant.attributes.every(
        (attr: any) => selectedOptions[attr.code] === String(attr.value_index)
      )
    );
    return match?.product?.sku || null;
  };

  const handleAddToCart = async () => {
    const skuToAdd = getSelectedVariantSku();

    if (!skuToAdd) {
      alert("Please select all options.");
      return;
    }

    const configurableAttributes = isConfigurable
      ? product.configurable_options.map((opt: any) => {
          const value = selectedOptions[opt.attribute_code];
          if (!value) return null;
          return {
            code: opt.attribute_code,
            option_id: parseInt(opt.attribute_id, 10),
            value_index: parseInt(value, 10),
          };
        }).filter(Boolean)
      : [];

    if (
      isConfigurable &&
      configurableAttributes.length !== product.configurable_options.length
    ) {
      alert("Please select all required options.");
      return;
    }

    setAdding(true);
    try {
      await addToCart(
        skuToAdd,
        1,
        product.__typename,
        isConfigurable ? product.sku : undefined,
        configurableAttributes
      );
      alert("Added to cart!");
    } catch (e: any) {
      alert("Failed to add to cart: " + e.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  const imageUrl = product?.small_image?.url?.startsWith("http")
    ? product.small_image.url
    : `https://magentodev.winkpayments.io${product?.small_image?.url ?? "/placeholder.png"}`;

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
        <div
          className="prose mt-4"
          dangerouslySetInnerHTML={{ __html: product.description?.html ?? "" }}
        />
        <p className="text-lg mt-4 text-center">
          Price:{" "}
          <span className="font-semibold">
            {product.price_range.minimum_price.final_price.currency}{" "}
            {product.price_range.minimum_price.final_price.value}
          </span>
        </p>

        {isConfigurable && (
          <div className="mt-4">
            {product.configurable_options.map((option: any) => (
              <div key={option.attribute_code} className="mt-2">
                <label className="block font-medium mb-1">{option.label}</label>
                <select
                  className="border px-2 py-1 rounded w-full"
                  onChange={(e) => handleOptionChange(option.attribute_code, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Select {option.label} --
                  </option>
                  {option.values.map((val: any) => (
                    <option key={val.value_index} value={val.value_index}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mt-6"
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </section>
  );
}
