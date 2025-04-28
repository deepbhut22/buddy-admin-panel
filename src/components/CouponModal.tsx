import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Coupon } from '../types';
import { createCoupon, updateCoupon } from '../api/coupons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';


interface CouponModalProps {
  coupon?: Coupon;
  onClose: () => void;
}

interface CouponName {
  name: string;
  isUsed: boolean;
}

export default function CouponModal({ coupon, onClose }: CouponModalProps) {
  const queryClient = useQueryClient();
  const [couponNames, setCouponNames] = useState<CouponName[]>(
    coupon?.name || [{ name: '', isUsed: false }]
  );
  const [formData, setFormData] = useState({
    name: coupon?.name || [],
    description: coupon?.description || '',
    company: coupon?.company || '',
    discount: coupon?.discount || '',
    startDate: coupon?.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
    endDate: coupon?.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
    category: coupon?.category?.join(', ') || '',
    products: coupon?.products?.join(', ') || '',
    remainingCoupons: coupon?.remainingCoupons || '',
    totalCoupons: coupon?.totalCoupons || '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(coupon?.images || []);

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
    
    // If it's a new image (not from existing coupon)
    if (index >= previewUrls.length - images.length) {
      newImages.splice(index - (previewUrls.length - images.length), 1);
    }
    
    newPreviewUrls.splice(index, 1);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const namesFromExcel = json
        .flat()
        .filter((val) => typeof val === 'string' && val.trim() !== '')
        .map((name) => ({ name: name.trim(), isUsed: false }));

      if (namesFromExcel.length) {
        setCouponNames(namesFromExcel);
        toast.success(`${namesFromExcel.length} coupon names loaded from Excel`);
      } else {
        toast.error('No valid coupon names found in the Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const formData = new FormData();
      // console.log(data);

      // formData.append('name', JSON.stringify(couponNames));
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'category' || key === 'products') {
          // Split by comma and trim each item to create array of strings
          const arrayValue = (value as string).split(',').map((item: string) => item.trim());
          formData.append(key, JSON.stringify(arrayValue));
        } else if (key === 'name') {
          formData.append(key, JSON.stringify(couponNames));
        } else {
          formData.append(key, String(value));
        }
      });

      console.log(formData.get('name'));
      

      // Append all images
      images.forEach((image) => {
        formData.append('images', image);
      });

      return coupon
        ? updateCoupon(coupon._id, formData)
        : createCoupon(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success(coupon ? 'Coupon updated successfully' : 'Coupon created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addCouponName = () => {
    console.log(couponNames);
    setCouponNames([...couponNames, { name: '', isUsed: false }]);
  };

  const removeCouponName = (index: number) => {
    if (couponNames.length > 1) {
      setCouponNames(couponNames.filter((_, i) => i !== index));
    }
  };

  const updateCouponName = (index: number, value: string) => {
    const newCouponNames = [...couponNames];
    newCouponNames[index] = { ...newCouponNames[index], name: value };
    setCouponNames(newCouponNames);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-1/2 h-[80%] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {coupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Coupon Names */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Names
              </label>
              <div className="space-y-2">
                {couponNames.map((couponName, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponName.name}
                      onChange={(e) => updateCouponName(index, e.target.value)}
                      className="flex-1 rounded-md border p-1 text-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={`Coupon Name ${index + 1}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeCouponName(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                      disabled={couponNames.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCouponName}
                  className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Coupon Name
                </button>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Excel File (.xlsx) for Coupon Names
                  </label>
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleExcelUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>
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
              {mutation.isPending ? 'Saving...' : coupon ? 'Save Changes' : 'Add Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}