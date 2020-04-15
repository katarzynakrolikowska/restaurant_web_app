import { Customer } from './../../app/models/customer';

export const customerStub: Customer = {
  email: 'a@abc.com',
    phoneNumber: '111222333',
    address: {
      customerName: 'A',
      street: 'B',
      houseNumber: '1C',
      postcode: '11-222',
      city: 'D'
    }
}