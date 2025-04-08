import React from 'react';
import { X } from 'lucide-react';
import { approveUser, rejectUser, deleteUser } from '../api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { User } from '../types';
interface UserModalProps {
  user: User;
  onClose: () => void;
}

export default function UserModal({ user, onClose }: UserModalProps) {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [showDoc, setShowDoc] = React.useState(false);


  const approveMutation = useMutation({
    mutationFn: () => approveUser(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User request approved successfully');
      onClose();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectUser(user._id, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User request rejected');
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Service Details</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Service:</span> {user.service}</p>
                <p><span className="font-medium">Category:</span> {user.category}</p>
                {/* <p><span className="font-medium">Requested:</span> {new Date(user.requestedAt).toLocaleDateString()}</p> */}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Documents</h3>
            <div className="mt-2">
              <button onClick={() => window.open(user.document.url, '_blank')}>
                Open Document
              </button>

            </div>
          </div>

          {!user.approvalDate && (
            <div className="mt-6">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                Rejection Reason
              </label>
              <textarea
                id="rejectionReason"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Close
            </button>
            {!user.approvalDate && (
              <>
                <button
                  type="button"
                  onClick={() => rejectMutation.mutate()}
                  className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => approveMutation.mutate()}
                  className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                >
                  Approve
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this user?')) {
                  deleteMutation.mutate();
                }
              }}
              className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}