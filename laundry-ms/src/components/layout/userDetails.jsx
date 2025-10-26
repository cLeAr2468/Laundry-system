import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || null);

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-blue-500 hover:bg-blue-600";
      case "staff":
        return "bg-green-500 hover:bg-green-600";
      case "user":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

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

  if (!user) return <div className="p-4">User not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" className="text-[#126280]" onClick={() => navigate('/dashboard/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* User Profile Header */}
        <div className="flex items-center space-x-4 pb-4 border-b">
          <div className="h-16 w-16 rounded-full bg-[#126280] flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800">{user.name}</h3>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                {user.role?.toUpperCase()}
              </Badge>
              <Badge className={`${getStatusBadgeColor(user.status)} text-white`}>
                {user.status?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* User Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <span className="text-slate-600 font-medium">Email:</span>
            <p className="text-slate-800 mt-1">{user.email || '—'}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Username:</span>
            <p className="text-slate-800 mt-1">{user.username || '—'}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Address:</span>
            <p className="text-slate-800 mt-1">{user.address || '—'}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Contact Number:</span>
            <p className="text-slate-800 mt-1">{user.contact || '—'}</p>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Date Registered:</span>
            <p className="text-slate-800 mt-1">{user.dateRegistered}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;