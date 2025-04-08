import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import DiscountModal from '../components/DiscountModal';
import { fetchDiscounts } from '../api/discounts';
import { Discount } from '../types';

export default function Discounts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    category: '',
  });

  const { data: discounts, isLoading } = useQuery({
    queryKey: ['discounts', filters],
    queryFn: () => fetchDiscounts(filters),
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Discounts</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Discount
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {discounts?.map((discount: any) => (
          <div
            key={discount._id}
            onClick={() => setSelectedDiscount(discount)}
            className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="h-48 w-full relative rounded-t-lg overflow-hidden">
              <img
                src={discount.images[0]}
                alt={discount.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                {discount.discount}% OFF
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {discount.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{discount.description.length > 100 ? discount.description.slice(0, 100) + '...' : discount.description.slice(0, 100)}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {discount.company}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {discount.remainingCoupons} remaining
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <DiscountModal onClose={() => setShowAddModal(false)} />
      )}
      {selectedDiscount && (
        <DiscountModal
          discount={selectedDiscount}
          onClose={() => setSelectedDiscount(null)}
        />
      )}
    </div>
  );
}