// src/graphql/queries/getProducts.ts
// src/graphql/queries/getProducts.ts
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
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
            regular_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;
