import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient"; // adjust if named differently
import Image from "next/image";

const GET_PRODUCT_BY_URL_KEY = gql`
  query GetProductByUrlKey($urlKey: String) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        name
        sku
        url_key
        description {
          html
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        image {
          url
        }
      }
    }
  }
`;

type Params = {
  params: {
    url_key: string;
  };
};

export default async function ProductDetailPage({ params }: Params) {
  const client = getClient();
  const { data } = await client.query({
    query: GET_PRODUCT_BY_URL_KEY,
    variables: { urlKey: params.url_key },
  });

  const product = data.products.items[0];

  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <Image
        src={`https://magentodev.winkpayments.io${product.image.url}`}
            alt={product.image.label}
                width={400}
                height={400}
      />
      <div
        className="mt-4 text-gray-700"
        dangerouslySetInnerHTML={{ __html: product.description.html }}
      />
      <p className="mt-4 text-xl">
        Price:{" "}
        <strong>
          {product.price_range.minimum_price.final_price.value}{" "}
          {product.price_range.minimum_price.final_price.currency}
        </strong>
      </p>
    </div>
  );
}
