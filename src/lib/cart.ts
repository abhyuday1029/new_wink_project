import { getClient } from "@/lib/apolloClient";
import {
  CREATE_CART,
  ADD_TO_CART,
  ADD_CONFIGURABLE_TO_CART,
} from "@/graphql/queries/cart";

export async function getOrCreateCart(): Promise<string> {
  if (typeof window === "undefined") return "";
  let cartId = localStorage.getItem("cart_id");
  if (cartId) return cartId;

  const client = getClient();
  const { data } = await client.mutate({ mutation: CREATE_CART });
  cartId = data?.createEmptyCart;

  if (cartId) {
    localStorage.setItem("cart_id", cartId);
  }

  return cartId!;
}

export async function addToCart(
  productSku: string,
  quantity = 1,
  productType: string = "SimpleProduct",
  parentSku?: string,
  configurableOptions?: { option_id: number; option_value: number }[]
) {
  const cartId = await getOrCreateCart();
  const client = getClient();

  try {
    const isConfigurable = productType === "ConfigurableProduct";

    if (isConfigurable && !parentSku) {
      throw new Error("Missing parent SKU for configurable product.");
    }

    const variables = isConfigurable
      ? {
          cartId,
          cartItems: [
            {
              parent_sku: parentSku,
              data: {
                sku: productSku,
                quantity,
              },
            },
          ],
        }
      : {
          cartId,
          cartItems: [
            {
              data: {
                sku: productSku,
                quantity,
              },
            },
          ],
        };

    const mutation = isConfigurable
      ? ADD_CONFIGURABLE_TO_CART
      : ADD_TO_CART;

    const result = await client.mutate({
      mutation,
      variables,
    });

    return isConfigurable
      ? result.data?.addConfigurableProductsToCart?.cart?.items || []
      : result.data?.addSimpleProductsToCart?.cart?.items || [];
  } catch (error: any) {
    console.error("❌ Add to cart failed:", error?.message || error);
    throw error;
  }
}





// import { getClient } from "@/lib/apolloClient";
// import {
//   CREATE_CART,
//   ADD_TO_CART,
//   ADD_CONFIGURABLE_TO_CART,
// } from "@/graphql/queries/cart";

// export async function getOrCreateCart(): Promise<string> {
//   if (typeof window === "undefined") return "";

//   let cartId = localStorage.getItem("cart_id");
//   if (cartId) return cartId;

//   const client = getClient();
//   const { data } = await client.mutate({ mutation: CREATE_CART });
//   cartId = data?.createEmptyCart;

//   if (cartId) {
//     localStorage.setItem("cart_id", cartId);
//   }

//   return cartId!;
// }

// export async function addToCart(
//   productSku: string,
//   quantity = 1,
//   productType: string = "SimpleProduct",
//   parentSku?: string,
//   configurableAttributes?: { code: string; value_index: number }[]
// ) {
//   const cartId = await getOrCreateCart();
//   const client = getClient();

//   try {
//     console.log("🛒 Adding to cart:", {
//       productSku,
//       quantity,
//       productType,
//       parentSku,
//       configurableAttributes,
//       cartId
//     });

//     const isConfigurable = productType === "ConfigurableProduct";

//     if (isConfigurable) {
//       if (!configurableAttributes || !parentSku) {
//         throw new Error("Missing attribute selections or parent SKU.");
//       }

//       // Convert attributes to the format Magento expects
//       const selectedConfigurableOptions = configurableAttributes.map(attr => ({
//         id: attr.code,
//         value_id: attr.value_index
//       }));

//       console.log("🔧 Configurable options:", selectedConfigurableOptions);

//       const result = await client.mutate({
//   mutation: ADD_CONFIGURABLE_TO_CART,
//   variables: {
//     cartId,
//     cartItems: [
//       {
//         parent_sku: parentSku,
//         variant_sku: productSku,
//         quantity,
//         configurable_options: configurableAttributes.map(attr => ({
//           option_id: attr.code, // this must be option **ID**, like "93"
//           option_value: attr.value_index,
//         })),
//       },
//     ],
//   },
// });


//       console.log("✅ Configurable product added:", result.data);
//       return result.data?.addConfigurableProductsToCart?.cart?.items || [];
//     } else {
//       const result = await client.mutate({
//         mutation: ADD_TO_CART,
//         variables: {
//           cartId,
//           cartItems: [
//             {
//               data: {
//                 sku: productSku,
//                 quantity,
//               },
//             },
//           ],
//         },
//       });

//       console.log("✅ Simple product added:", result.data);
//       return result.data?.addSimpleProductsToCart?.cart?.items || [];
//     }
//   } catch (error: any) {
//     console.error("❌ Add to cart failed:", error?.message || error);
//     console.error("📋 Full error:", error);
//     throw error;
//   }
// }