import { useEffect, useState } from 'react';
import { Plus, ArrowUpDown, Calendar, Tag, Building, Percent, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import CouponModal from '../components/CouponModal';
import { fetchCoupons } from '../api/coupons';
import { Coupon } from '../types';

type StatusType = 'all' | 'expired' | 'active' | 'used';
type SortByType = 'startDate' | 'endDate';
type SortOrderType = 'asc' | 'desc';

interface CouponName {
  name: string;
  isUsed: boolean;
}

export default function Coupons() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    category: '',
    status: 'all' as StatusType,
    sortBy: undefined as SortByType | undefined,
    sortOrder: 'asc' as SortOrderType,
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchData = async () => {
    const response = await fetchCoupons(filters);
    setCoupons(response);
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    fetchData();
  }, [filters, showAddModal, refresh]);

  useEffect(() => {
    fetchData();
  }, [showAddModal, refresh]);

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

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  // Function to determine coupon status
  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date();
    const endDate = new Date(coupon.endDate);
    const hasUnusedCoupons = coupon.name.some((name) => name.isUsed === false);
    
    if (!hasUnusedCoupons) {
      return { label: 'Used', color: 'bg-gray-500' };
    } else if (endDate < now) {
      return { label: 'Expired', color: 'bg-red-500' };
    } else {
      return { label: 'Active', color: 'bg-green-500' };
    }
  };

  // Format date to readable string
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Count used and unused coupons
  const getCouponCounts = (coupon: Coupon) => {
    const usedCount = coupon.name.filter(name => name.isUsed).length;
    const unusedCount = coupon.name.filter(name => !name.isUsed).length;
    return { used: usedCount, unused: unusedCount };
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </button>
          <button
            style={{ marginLeft: '10px' }}
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            refresh
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
            <option value="all">All Coupons</option>
            <option value="active">Active Coupons</option>
            <option value="expired">Expired Coupons</option>
            <option value="used">Used Coupons</option>
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
        
        <h2 className='text-center text-gray-900'>
          Total coupons: {coupons.length}
        </h2>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coupons?.map((coupon) => {
          
          const status = getCouponStatus(coupon);
          const counts = getCouponCounts(coupon);
          return (
            <div
              key={coupon._id}
              onClick={() => setSelectedCoupon(coupon)}
              className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img
                  src={coupon.images[0]}
                  alt={coupon.name[0].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                  {coupon.discount}% OFF
                </div>
                <div className={`absolute top-2 left-2 ${status.color} text-white px-2 py-1 rounded text-sm`}>
                  {status.label}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {coupon.name[0].name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{coupon.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{coupon.company}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{coupon.category.join(', ')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Percent className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{coupon.remainingCoupons} of {coupon.totalCoupons} remaining</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>{counts.unused} unused</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span>{counts.used} used</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <CouponModal onClose={() => setShowAddModal(false)} />
      )}
      {selectedCoupon && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  );
}