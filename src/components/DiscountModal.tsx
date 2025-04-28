import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Discount } from '../types';
import { createDiscount, updateDiscount } from '../api/discounts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface DiscountModalProps {
  discount?: Discount;
  onClose: () => void;
}

export default function DiscountModal({ discount, onClose }: DiscountModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: discount?.name || '',
    description: discount?.description || '',
    company: discount?.company || '',
    discount: discount?.discount || '',
    startDate: discount?.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
    endDate: discount?.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
    category: discount?.category?.join(', ') || '',
    products: discount?.products?.join(', ') || '',
    remainingCoupons: discount?.remainingCoupons || '',
    totalCoupons: discount?.totalCoupons || '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(discount?.images || []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);

    // Create preview URLs for new images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];
    
    // If it's a new image (not from existing discount)
    if (index >= previewUrls.length - images.length) {
      newImages.splice(index - (previewUrls.length - images.length), 1);
    }
    
    newPreviewUrls.splice(index, 1);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        // if (key === 'category' || key === 'products') {
        //   const arrayValue = String(value)
        //     .split(',')
        //     .map((item) => item.trim());  // Split and trim
        //   formData.append(key, JSON.stringify(arrayValue));  // Stringify array
        // } else {
          formData.append(key, String(value));  // Normal fields
        // }
      });

      // Append all images
      images.forEach((image) => {
        formData.append('images', image);
      });

      // ❌ Don't do: const discountData = Object.fromEntries(formData.entries());
      // ❌ Don't parse arrays here
      // ✅ Just send FormData directly!

      if (discount) {
        return updateDiscount(discount._id, formData as Partial<Discount>);  // send FormData directly
      } else {
        return createDiscount(formData as Partial<Discount>);               // send FormData directly
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success(discount ? 'Discount updated successfully' : 'Discount created successfully');
      onClose();
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-1/2 h-[80%] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {discount ? 'Edit Discount' : 'Add New Discount'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categories (comma-separated)
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="products" className="block text-sm font-medium text-gray-700">
                Products (comma-separated)
              </label>
              <input
                type="text"
                id="products"
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="remainingCoupons" className="block text-sm font-medium text-gray-700">
                  Remaining Coupons
                </label>
                <input
                  type="number"
                  id="remainingCoupons"
                  value={formData.remainingCoupons}
                  onChange={(e) => setFormData({ ...formData, remainingCoupons: e.target.value })}
                  className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="totalCoupons" className="block text-sm font-medium text-gray-700">
                  Total Coupons
                </label>
                <input
                  type="number"
                  id="totalCoupons"
                  value={formData.totalCoupons}
                  onChange={(e) => setFormData({ ...formData, totalCoupons: e.target.value })}
                  className="mt-1 block w-full rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Plus className="h-8 w-8 text-gray-400" />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : discount ? 'Save Changes' : 'Add Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}