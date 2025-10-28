import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';

const ShopDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [shop, setShop] = useState(location.state?.shop || null);

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "inactive":
        return "bg-red-500 hover:bg-red-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (!shop) return <div className="p-4">Shop not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" className="text-[#126280]" onClick={() => navigate('/dashboard/shops')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shops
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Shop Profile Header */}
        <div className="flex items-center space-x-4 pb-4 border-b">
          <div className="h-16 w-16 rounded-full bg-[#31748f] flex items-center justify-center text-white text-2xl font-bold">
            {shop.laundryName?.charAt(0) || 'L'}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800">{shop.laundryName}</h3>
            <p className="text-sm text-slate-600 mt-1">{shop.ownerName}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={`${getStatusBadgeColor(shop.status)} text-white`}>
                {shop.status?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Shop Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <span className="text-slate-600 font-medium">Owner Name:</span>
            <p className="text-slate-800 mt-1">{shop.ownerName}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Contact Number:</span>
            <p className="text-slate-800 mt-1">{shop.contactNumber || '—'}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Address:</span>
            <p className="text-slate-800 mt-1">{shop.address || '—'}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Type of Laundry:</span>
            <p className="text-slate-800 mt-1">{shop.laundryType}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Date Registered:</span>
            <p className="text-slate-800 mt-1">{shop.dateRegistered}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
