import { gql } from "@apollo/client";

// Create a new empty cart
export const CREATE_CART = gql`
  mutation {
    createEmptyCart
  }
`;

// Add simple product to cart
export const ADD_TO_CART = gql`
  mutation AddSimpleProductsToCart(
    $cartId: String!
    $cartItems: [SimpleProductCartItemInput!]!
  ) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: $cartItems
      }
    ) {
      cart {
        items {
          id
          quantity
          product {
            sku
            name
          }
        }
      }
    }
  }
`;

// ✅ Corrected mutation for configurable products
export const ADD_CONFIGURABLE_TO_CART = gql`
  mutation AddConfigurableProductsToCart(
    $cartId: String!
    $cartItems: [ConfigurableCartItemInput!]!
  ) {
    addConfigurableProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: $cartItems
      }
    ) {
      cart {
        items {
          id
          quantity
          product {
            sku
            name
          }
        }
      }
    }
  }
`;
