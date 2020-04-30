import { Photo } from "../../admin/models/photo";

export interface Dish {
  id?: number;
  name: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  }
  amount: number;
  mainPhoto?: Photo
}