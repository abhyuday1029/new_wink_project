// src/app/layout.tsx
//import "./globals.css";
// app/layout.tsx
import ApolloWrapper from "@/lib/apolloWrapper";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}

