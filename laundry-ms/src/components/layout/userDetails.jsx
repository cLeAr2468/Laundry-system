import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft } from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/public/users/${id}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to load user');
        const data = await res.json();
        const u = data.data;
        const rawDate = u.createdAt || u.created_at || u.registrationDate || u.registeredAt || null;
        const parsedDate = rawDate ? new Date(rawDate) : null;
        setUser({
          id: u.id,
          name: `${u.user_lName}, ${u.user_fName} ${u.user_mName}`,
          email: u.email,
          username: u.username,
          contact: u.contactNum,
          role: u.role || 'user',
          status: u.status || 'active',
          dateRegistered: parsedDate && !isNaN(parsedDate) ? parsedDate.toLocaleDateString() : '—',
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, user]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">User not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-[#126280]" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="text-[#126280] font-semibold">User Information</div>
      </div>
      <Card className="bg-white border-0 shadow">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
          <div><span className="text-slate-600 font-medium">Name:</span> <span className="text-slate-800">{user.name}</span></div>
          <div><span className="text-slate-600 font-medium">Email:</span> <span className="text-slate-800">{user.email}</span></div>
          <div><span className="text-slate-600 font-medium">Username:</span> <span className="text-slate-800">{user.username}</span></div>
          <div><span className="text-slate-600 font-medium">Contact:</span> <span className="text-slate-800">{user.contact}</span></div>
          <div><span className="text-slate-600 font-medium">Role:</span> <span className="text-slate-800 uppercase">{user.role}</span></div>
          <div><span className="text-slate-600 font-medium">Status:</span> <span className="text-slate-800 uppercase">{user.status}</span></div>
          <div><span className="text-slate-600 font-medium">Date Registered:</span> <span className="text-slate-800">{user.dateRegistered}</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
