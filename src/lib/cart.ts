import { getClient } from "@/lib/apolloClient";
import {
  CREATE_CART,
  ADD_TO_CART,
  ADD_CONFIGURABLE_TO_CART,
} from "@/graphql/queries/cart";

// Safe Base64 encode supporting UTF-8
function encodeBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

function buildConfigurableSelectedOptions(
  configurableOptions: { option_id: number; option_value: number }[]
): string[] {
  return configurableOptions.map(({ option_id, option_value }) =>
    encodeBase64(`configurable_option_${option_id}_${option_value}`)
  );
}

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

    if (isConfigurable) {
      if (!configurableOptions || !parentSku) {
        throw new Error("Missing options or parent SKU for configurable product.");
      }

      const selected_options = buildConfigurableSelectedOptions(configurableOptions);

      const variables = {
        cartId,
        cartItems: [
          {
            parent_sku: parentSku,
            data: {
              quantity,
              sku: productSku,
              selected_options, // ✅ FIXED: now inside `data`
            },
          },
        ],
      };

      console.log("🧪 Sending configurable cart mutation with:", variables);

      const result = await client.mutate({
        mutation: ADD_CONFIGURABLE_TO_CART,
        variables,
      });

      return result.data?.addConfigurableProductsToCart?.cart?.items || [];
    } else {
      const variables = {
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

      console.log("🧪 Sending simple cart mutation with:", variables);

      const result = await client.mutate({
        mutation: ADD_TO_CART,
        variables,
      });

      return result.data?.addSimpleProductsToCart?.cart?.items || [];
    }
  } catch (error: any) {
    console.error("❌ Add to cart failed:", error?.message || error);

    if (error.networkError?.result?.errors) {
      console.error("GraphQL errors:", error.networkError.result.errors);
    }

    if (error.graphQLErrors) {
      console.error("GraphQL errors (graphQLErrors):", error.graphQLErrors);
    }

    if (error.networkError) {
      console.error("Network error details:", error.networkError);
    }

    throw error;
  }
}
