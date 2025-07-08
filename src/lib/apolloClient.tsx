// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const getClient = () =>
  new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: "https://magentodev.winkpayments.io/graphql",
      headers: {
        Authorization: `Bearer uf6r64dm54or6kx6wouyu1ma7pxpnrdt`,
      },
      // 👇 Cast options to `any` to allow `agent`
      fetch: (url, options) =>
        fetch(url, {
          ...(options as any),
          agent: httpsAgent,
        }),
    }),
    cache: new InMemoryCache(),
  });





// import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// import fetch from "cross-fetch"; // ✅ for server compatibility

// export const getClient = () =>
//   new ApolloClient({
//     ssrMode: true,
//     link: new HttpLink({
//       uri: "https://magentodev.winkpayments.io/graphql",
//       headers: {
//         Authorization: `Bearer uf6r64dm54or6kx6wouyu1ma7pxpnrdt`,
//       },
//       fetch,
//     }),
//     cache: new InMemoryCache(),
//   });


