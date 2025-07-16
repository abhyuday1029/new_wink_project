//sc/graphql/queries/cart.ts
import { gql } from "@apollo/client";

export const CREATE_CART = gql`
  mutation {
    createEmptyCart
  }
`;

export const ADD_TO_CART = gql`
  mutation AddSimpleProductsToCart(
    $cartId: String!
    $cartItems: [SimpleProductCartItemInput!]!
  ) {
    addSimpleProductsToCart(
      input: { cart_id: $cartId, cart_items: $cartItems }
    ) {
      cart {
        items {
          id
          quantity
          product {
            name
            sku
          }
        }
      }
    }
  }
`;

export const ADD_CONFIGURABLE_TO_CART = gql`
  mutation AddConfigurableProductsToCart(
    $cartId: String!
    $cartItems: [ConfigurableProductCartItemInput!]!
  ) {
    addConfigurableProductsToCart(
      input: { cart_id: $cartId, cart_items: $cartItems }
    ) {
      cart {
        items {
          id
          quantity
          product {
            name
            sku
          }
          ... on ConfigurableCartItem {
            configurable_options {
              option_label
            }
          }
        }
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      items {
        id
        quantity
        product {
          name
          sku
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
  }
`;