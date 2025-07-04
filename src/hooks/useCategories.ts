import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/graphql/queries/getCategories";

export const useCategories = () => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  const categories = data?.categories?.items || [];

  return { categories, loading, error };
};
