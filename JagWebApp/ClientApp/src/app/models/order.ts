import { Customer } from './customer';
import { OrderedItem } from "./orderd-item";

export interface Order {
  id?: number,
  user?: Customer,
  date: Date,
  items: Array<OrderedItem>,
  total: number,
  info?: string;  
}