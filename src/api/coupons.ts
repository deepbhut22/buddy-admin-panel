import axios from 'axios';
import { Coupon } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCoupons = async (filters: {
  search?: string;
  company?: string;
  category?: string;
  type?: string;
  status?: 'all' | 'expired' | 'active' | 'used';
  sortBy?: 'startDate' | 'endDate';
  sortOrder?: 'asc' | 'desc';
}) => {
  const response = await axios.get(`${API_URL}/admin/coupons`, {
    params: filters,
    withCredentials: true,
  });
  
  let filteredData = response.data;
  
  // Apply client-side filtering if status is specified
  if (filters.status && filters.status !== 'all') {
    const now = new Date();
    
    filteredData = filteredData.filter((coupon: Coupon) => {
      const endDate = new Date(coupon.endDate);
      const hasUnusedCoupons = coupon.name.some((name) => name.isUsed === false);
      
      if (filters.status === 'expired') {
        // Expired: end date has passed but coupons are still available
        return endDate < now && hasUnusedCoupons;
      } else if (filters.status === 'active') {
        // Active: end date hasn't passed and coupons are available
        return endDate > now && hasUnusedCoupons;
      } else if (filters.status === 'used') {
        // Used: all coupons have been redeemed
        return coupon.name.every((name) => name.isUsed === true);
      }
      
      return true;
    });
  }
  
  // Apply sorting if specified
  if (filters.sortBy) {
    filteredData.sort((a: Coupon, b: Coupon) => {
      const dateA = new Date(filters.sortBy === 'startDate' ? a.startDate : a.endDate);
      const dateB = new Date(filters.sortBy === 'startDate' ? b.startDate : b.endDate);
      
      return filters.sortOrder === 'desc' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  }
  
  return filteredData;
};

export const createCoupon = async (couponData: FormData) => {
  const response = await axios.post(
    `${API_URL}/admin/coupons`,
    couponData,
    { 
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateCoupon = async (couponId: string, couponData: FormData) => {
  const response = await axios.put(
    `${API_URL}/admin/coupons/${couponId}`,
    couponData,
    { 
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};