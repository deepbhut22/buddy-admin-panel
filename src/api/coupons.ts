import axios from 'axios';
import { Coupon } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCoupons = async (filters: {
  search?: string;
  company?: string;
  category?: string;
  type: string;
}) => {
  const response = await axios.get(`${API_URL}/admin/coupons`, {
    params: filters,
    withCredentials: true,
  });
  if (filters.type === 'All') {
    return response.data;
  } else if (filters.type === 'Unused') {
    return response.data.filter((coupon: Coupon) =>
      coupon.name.some((name) => name.isUsed === false) && coupon.endDate < new Date());
  } else if (filters.type === 'Used') {
    return response.data.filter((coupon: Coupon) =>
      coupon.name.every((name) => name.isUsed === true));
  } else if (filters.type === 'Expired') {
    return response.data.filter((coupon: Coupon) => coupon.endDate < new Date());
  } else if (filters.type === 'Active') {
    console.log("here");
    return response.data.filter((coupon: Coupon) => coupon.endDate > new Date() && 
      coupon.name.some((name) => name.isUsed === false));
  }
};

export const createCoupon = async (couponData: Partial<Coupon>) => {
  const response = await axios.post(
    `${API_URL}/admin/coupons`,
    couponData,
    { withCredentials: true }
  );
  return response.data;
};

export const updateCoupon = async (couponId: string, couponData: Partial<Coupon>) => {
  const response = await axios.put(
    `${API_URL}/admin/coupons/${couponId}`,
    couponData,
    { withCredentials: true }
  );
  return response.data;
};