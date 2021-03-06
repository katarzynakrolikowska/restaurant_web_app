import { Order } from 'shared/models/order';
import { customerStub } from './customer.stub';
import { orderedItemStub } from './ordered-item.stub';

export const orderStub: Order = {
  id: 1,
  user: customerStub,
  date: new Date(),
  items: [
    orderedItemStub
  ],
  total: 1,
  status: {
    id: 1,
    name: 'a'
  }
}