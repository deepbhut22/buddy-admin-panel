import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CouponModal from '../components/CouponModal';
import { fetchCoupons } from '../api/coupons';
import { Coupon } from '../types';

export default function Coupons() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    category: '',
    type: 'All',
  });

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchData = async (filter = "All") => {
    if (filter === "All") {
      const response = await fetchCoupons(filters);
      setCoupons(response);
    } else {
      const response = await fetchCoupons(filters);
      setCoupons(response.filter((coupon: Coupon) => coupon.name.some((name) => name.isUsed === false)));
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [showAddModal]);

  const handleSelectChange = (value: string) => {
    console.log(value);
    setFilters({ ...filters, type: value });
  }


  // const { data: coupons, isLoading } = useQuery({
  //   queryKey: ['coupons', filters],
  //   queryFn: () => fetchCoupons(filters),
  // });

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
        </div>
      </div>

      <div className='flex gap-2'>
        {/* <select
          className="mt-4 w-full sm:w-1/3 border border-gray-300 rounded-md p-2"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        >
          <option value="">All Coupons</option>
          <option value="Company A">All Coupons</option>
          <option value="Company B">Active Coupons</option>
        </select> */}
        <select
          className="mt-4 w-full sm:w-1/3 border border-gray-300 rounded-md p-2"
          value={filters.type}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          <option value="All">All Coupons</option>
          <option value="Active">Active Coupons</option>
          <option value="Expired">Expired Coupons</option>
          <option value="Used">Used Coupons</option>
          <option value="Unused">Unused Coupons</option>
        </select>
        <h2 className='mt-4 text-center text-gray-900'>
          total coupons: {coupons.length}
        </h2>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coupons?.map((coupon) => (
          <div
            key={coupon._id}
            onClick={() => setSelectedCoupon(coupon)}
            className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="h-48 w-full relative rounded-t-lg overflow-hidden">
              <img
                src={coupon.images[0]}
                alt={coupon.name[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                {coupon.discount}% OFF
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {coupon.name[0].name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{coupon.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {coupon.company}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {coupon.remainingCoupons} remaining
                </span>
              </div>
            </div>
          </div>
        ))}
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