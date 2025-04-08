export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  service: string;
  category: string;
  document: {
    name: string;
    url: string;
  };
  approvalDate?: Date;
  buddyId?: string;
  buddyCredit?: number;
}

export interface UserRequest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  document: {
    name: string;
    url: string;
  };
  service: string;
  category: string;
  requestedAt: Date;
}

export interface Discount {
  _id: string;
  name: string;
  description: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  category: string[];
  products: string[];
  company: string;
  images: string[];
  remainingCoupons: number;
  totalCoupons: number;
}

export interface Coupon {
  _id: string;
  name: {
    name: string;
    isUsed: boolean;
  }[];
  description: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  category: string[];
  products: string[];
  company: string;
  images: string[];
  remainingCoupons: number;
  totalCoupons: number;
}