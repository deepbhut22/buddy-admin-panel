import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, ArrowUpDown, Calendar, Tag, Building, Percent } from 'lucide-react';
import DiscountModal from '../components/DiscountModal';
import { fetchDiscounts } from '../api/discounts';
import { Discount } from '../types';

type StatusType = 'all' | 'expired' | 'active' | 'used';
type SortByType = 'startDate' | 'endDate';
type SortOrderType = 'asc' | 'desc';

export default function Discounts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    category: '',
    status: 'all' as StatusType,
    sortBy: undefined as SortByType | undefined,
    sortOrder: 'asc' as SortOrderType,
  });

  const { data: discounts, isLoading } = useQuery({
    queryKey: ['discounts', filters],
    queryFn: () => fetchDiscounts(filters),
  });

  const handleStatusChange = (status: StatusType) => {
    setFilters({ ...filters, status });
  };

  const handleSortChange = (sortBy: SortByType) => {
    // If already sorting by this field, toggle the order
    if (filters.sortBy === sortBy) {
      setFilters({ 
        ...filters, 
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      // Otherwise, set the new sort field with default ascending order
      setFilters({ ...filters, sortBy, sortOrder: 'asc' });
    }
  };

  // Function to determine discount status
  const getDiscountStatus = (discount: Discount) => {
    const now = new Date();
    const endDate = new Date(discount.endDate);
    
    if (discount.remainingCoupons === 0) {
      return { label: 'Used', color: 'bg-gray-500' };
    } else if (endDate < now) {
      return { label: 'Expired', color: 'bg-red-500' };
    } else {
      return { label: 'Active', color: 'bg-green-500' };
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

      {/* Filters and Sorting */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <select
            className="rounded-md border border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value as StatusType)}
          >
            <option value="all">All Discounts</option>
            <option value="active">Active Discounts</option>
            <option value="expired">Expired Discounts</option>
            <option value="used">Used Discounts</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            className={`flex items-center rounded-md border ${
              filters.sortBy === 'startDate' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            } py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
            onClick={() => handleSortChange('startDate')}
          >
            Start Date
            {filters.sortBy === 'startDate' && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            className={`flex items-center rounded-md border ${
              filters.sortBy === 'endDate' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            } py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
            onClick={() => handleSortChange('endDate')}
          >
            End Date
            {filters.sortBy === 'endDate' && (
              <ArrowUpDown className={`ml-1 h-4 w-4 ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {discounts?.map((discount: any) => {
          const status = getDiscountStatus(discount);
          return (
            <div
              key={discount._id}
              onClick={() => setSelectedDiscount(discount)}
              className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img
                  src={discount.images[0]}
                  alt={discount.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                  {discount.discount}% OFF
                </div>
                <div className={`absolute top-2 left-2 ${status.color} text-white px-2 py-1 rounded text-sm`}>
                  {status.label}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {discount.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{discount.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{discount.company}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatDate(discount.startDate)} - {formatDate(discount.endDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{discount.category.join(', ')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Percent className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{discount.remainingCoupons} of {discount.totalCoupons} remaining</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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