"use client";

import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import { useState, useEffect } from "react";
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

export default function ProductDetailPage({ params }: { params: { url_key: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const cleanUrlKey = decodeURIComponent(params.url_key).replace(/\.html$/, "");

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
        console.error(err);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [cleanUrlKey]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  const isConfigurable = product.__typename === "ConfigurableProduct";

  const imageUrl = product.small_image?.url?.startsWith("http")
    ? product.small_image.url
    : `https://magentodev.winkpayments.io${product.small_image?.url ?? "/placeholder.png"}`;

  const handleOptionChange = (code: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [code]: value }));
  };

  const getSelectedVariantSku = () => {
    if (!isConfigurable) return product.sku;

    const match = product.variants.find((variant: any) =>
      variant.attributes.every((attr: any) => selectedOptions[attr.code] === String(attr.value_index))
    );

    return match?.product?.sku || null;
  };

  const handleAddToCart = async () => {
    const skuToAdd = getSelectedVariantSku();
    if (!skuToAdd) {
      alert("Please select all options.");
      return;
    }

    const configurableOptions = isConfigurable
      ? product.configurable_options.map((opt: any) => ({
          option_id: Number(opt.attribute_id),
          option_value: Number(selectedOptions[opt.attribute_code]),
        }))
      : [];

    // ✅ Check if any selected option is missing
    if (isConfigurable && configurableOptions.some(opt => isNaN(opt.option_value))) {
      alert("Please select all options before adding to cart.");
      return;
    }

    // ✅ Debug logs
    console.log("Selected Options:", selectedOptions);
    console.log("Configurable Options:", configurableOptions);
    console.log("Variant SKU:", skuToAdd);
    console.log("Parent SKU:", product.sku);

    setAdding(true);
    try {
      await addToCart(
        skuToAdd,
        1,
        product.__typename,
        product.sku,
        configurableOptions
      );
      alert("Added to cart!");
    } catch (e) {
      alert("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

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

        {/* Configurable options */}
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
