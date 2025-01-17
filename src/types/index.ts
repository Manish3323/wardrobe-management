export type ClothingItem = {
  id: string;
  user_id: string;
  name: string;
  image_url: string;
  category: string;
  color: string;
  style: string;
  tags: string[];
  created_at: string;
};

export type OutfitPlan = {
  id: string;
  user_id: string;
  name: string;
  items: string[];
  created_at: string;
};