import { Address } from './address';

export interface Customer {
  email?: string;
  phoneNumber: string;
  address: Address;
}