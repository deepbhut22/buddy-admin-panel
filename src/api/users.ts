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

export const rejectUser = async (requestId: string, reason: string) => {
  const response = await axios.post(
    `${API_URL}/admin/requests/${requestId}/reject`,
    { reason },
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

export const banUser = async (userId: string, banReason: string) => {
  const response = await axios.post(
    `${API_URL}/admin/users/${userId}/ban`,
    { banReason },
    { withCredentials: true }
  );
  return response.data;
};

export const unbanUser = async (userId: string) => {
  const response = await axios.post(
    `${API_URL}/admin/users/${userId}/unban`,
    {},
    { withCredentials: true }
  );
  return response.data;
};