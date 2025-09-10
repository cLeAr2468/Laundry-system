import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft } from 'lucide-react';

const ShopDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [shop, setShop] = useState(location.state?.shop || null);
  const [loading, setLoading] = useState(!location.state?.shop);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shop) return;
    const fetchShop = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/laundry-shops/${id}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to load shop');
        const data = await res.json();
        const s = data.data;
        const rawDate = s.createdAt || s.created_at || s.registrationDate || s.registeredAt || s.shop_createdAt || null;
        const parsedDate = rawDate ? new Date(rawDate) : null;
        setShop({
          id: s.owner_id,
          ownerName: `${s.owner_lName}, ${s.owner_fName} ${s.owner_mName}`,
          contactNumber: s.owner_contactNum,
          address: s.shop_address,
          laundryName: s.shop_name || 'N/A',
          laundryType: s.shop_type || 'N/A',
          status: s.shop_status,
          dateRegistered: parsedDate && !isNaN(parsedDate) ? parsedDate.toLocaleDateString() : '—',
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id, shop]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!shop) return <div className="p-4">Shop not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-[#126280]" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-[#126280] font-semibold">Laundry Shop Information</div>
      </div>
      <Card className="bg-white border-0 shadow">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
          <div><span className="text-slate-600 font-medium">Owner:</span> <span className="text-slate-800">{shop.ownerName}</span></div>
          <div><span className="text-slate-600 font-medium">Laundry Name:</span> <span className="text-slate-800">{shop.laundryName}</span></div>
          <div><span className="text-slate-600 font-medium">Contact:</span> <span className="text-slate-800">{shop.contactNumber}</span></div>
          <div><span className="text-slate-600 font-medium">Address:</span> <span className="text-slate-800">{shop.address}</span></div>
          <div><span className="text-slate-600 font-medium">Type:</span> <span className="text-slate-800">{shop.laundryType}</span></div>
          <div><span className="text-slate-600 font-medium">Status:</span> <span className="text-slate-800">{shop.status}</span></div>
          <div><span className="text-slate-600 font-medium">Date Registered:</span> <span className="text-slate-800">{shop.dateRegistered}</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopDetails;
