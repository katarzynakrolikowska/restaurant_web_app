import { OrderedItem } from "./orderd-item";

export interface Order {
  id?: number,
  date: Date,
  items: Array<OrderedItem>,
  total: number,
  info?: string;  
}