export type Product = { 
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  url_key: string; // 👈 Add this line
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};
