import React from 'react';
import { BarChart, Users, Tag, Ticket } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: Users,
    },
    {
      name: 'Active Discounts',
      value: '45',
      change: '+3.2%',
      icon: Tag,
    },
    {
      name: 'Used Coupons',
      value: '1,280',
      change: '+28.4%',
      icon: Ticket,
    },
    {
      name: 'Revenue Generated',
      value: '$12,430',
      change: '+18.3%',
      icon: BarChart,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}