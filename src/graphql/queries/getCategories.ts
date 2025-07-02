import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(
      filters: {
        ids: { in: ["3", "9", "12", "21", "38", "39"] }
        parent_id: { in: ["2"] }
      }
      pageSize: 2
      currentPage: 1
    ) {
      total_count
      items {
        uid
        level
        name
        path
        children_count
        children {
          uid
          level
          name
          path
          children_count
          children {
            uid
            level
            name
            path
          }
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;
