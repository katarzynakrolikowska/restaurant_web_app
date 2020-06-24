import { Status } from './status';
import { Customer } from './customer';
import { OrderedItem } from "./orderd-item";

export interface Order {
  id?: number,
  user?: Customer,
  date: Date,
  items: OrderedItem[],
  total: number,
  info?: string;
  status: Status;
}