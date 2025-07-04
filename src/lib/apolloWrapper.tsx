// src/lib/ApolloWrapper.tsx

"use client";

import { ApolloProvider } from "@apollo/client";
import { getClient } from "./apolloClient"; // update this path to match your actual client path

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={getClient()}>{children}</ApolloProvider>;
}
