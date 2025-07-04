// lib/apolloClient.tsx
// import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "https://magentodev.winkpayments.io/graphql",
//     headers: {
//       Authorization: "Bearer uf6r64dm54or6kx6wouy1lma7pxprndt",
//     },
//   }),
//   cache: new InMemoryCache(),
// });

// export default client;


import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const getClient = () => {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: "https://magentodev.winkpayments.io/graphql",
      headers: {
        Authorization: `Bearer uf6r64dm54or6kx6wouyu1ma7pxpnrdt`,
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
};

