// src/app/categories/page.tsx
"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/graphql/queries/getCategories";

export default function CategoriesPage() {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Failed to load categories: {error.message}</p>;

  const categories = data?.categories?.items || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Magento Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat: any) => (
          <li key={cat.uid} className="p-3 border rounded shadow">
            <h3>{cat.name}</h3>

            {/* Render child categories */}
            {cat.children?.length > 0 && (
              <ul className="pl-4 text-sm text-gray-600 list-disc mt-2">
                {cat.children.map((child: any) => (
                  <li key={child.uid}>
                    {child.name}
                    {/* Render grand-children */}
                    {child.children?.length > 0 && (
                      <ul className="pl-4 text-xs list-circle mt-1">
                        {child.children.map((grand: any) => (
                          <li key={grand.uid}>{grand.name}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
