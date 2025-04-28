import axios from 'axios';
import { Discount } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchDiscounts = async (filters: {
  search?: string;
  company?: string;
  category?: string;
  status?: 'all' | 'expired' | 'active' | 'used';
  sortBy?: 'startDate' | 'endDate';
  sortOrder?: 'asc' | 'desc';
}) => {
  const response = await axios.get(`${API_URL}/admin/discounts`, {
    params: filters,
    withCredentials: true,
  });
  
  let filteredData = response.data;
  
  // Apply client-side filtering if status is specified
  if (filters.status && filters.status !== 'all') {
    const now = new Date();
    
    filteredData = filteredData.filter((discount: Discount) => {
      const endDate = new Date(discount.endDate);
      
      if (filters.status === 'expired') {
        // Expired: end date has passed but coupons are still available
        return endDate < now && discount.remainingCoupons > 0;
      } else if (filters.status === 'active') {
        // Active: end date hasn't passed and coupons are available
        return endDate > now && discount.remainingCoupons > 0;
      } else if (filters.status === 'used') {
        // Used: all coupons have been redeemed
        return discount.remainingCoupons === 0;
      }
      
      return true;
    });
  }
  
  // Apply sorting if specified
  if (filters.sortBy) {
    filteredData.sort((a: Discount, b: Discount) => {
      const dateA = new Date(filters.sortBy === 'startDate' ? a.startDate : a.endDate);
      const dateB = new Date(filters.sortBy === 'startDate' ? b.startDate : b.endDate);
      
      return filters.sortOrder === 'desc' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  }
  
  return filteredData;
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