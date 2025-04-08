import axios from 'axios';
import { Discount } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchDiscounts = async (filters: {
  search?: string;
  company?: string;
  category?: string;
}) => {
  const response = await axios.get(`${API_URL}/admin/discounts`, {
    params: filters,
    withCredentials: true,
  });
  return response.data;
};

export const createDiscount = async (discountData: Partial<Discount>) => {
  const response = await axios.post(
    `${API_URL}/admin/discounts`,
    discountData,
    { withCredentials: true }
  );
  return response.data;
};

export const updateDiscount = async (discountId: string, discountData: Partial<Discount>) => {
  const response = await axios.put(
    `${API_URL}/admin/discounts/${discountId}`,
    discountData,
    { withCredentials: true }
  );
  return response.data;
};