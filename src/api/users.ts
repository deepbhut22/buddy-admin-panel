import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchUsers = async ({ status, search }: { status: string; search: string }) => {
  const response = await axios.get(`${API_URL}/admin/requests`, {
    params: { status, search },
    withCredentials: true,
  });
  return response.data;
};

export const approveUser = async (requestId: string) => {
  const response = await axios.post(
    `${API_URL}/admin/requests/${requestId}/approve`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const rejectUser = async (requestId: string, rejectionReason: string) => {
  const response = await axios.post(
    `${API_URL}/admin/requests/${requestId}/reject`,
    { rejectionReason },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(
    `${API_URL}/admin/users/${userId}`,
    { withCredentials: true }
  );
  return response.data;
};