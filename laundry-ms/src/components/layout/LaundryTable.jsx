import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Power } from "lucide-react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Link } from 'react-router-dom';

const LaundryTable = () => {
    const [laundryShops, setLaundryShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLaundryShops = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/laundry-shops', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include', // This will send the cookies with the request
                    mode: 'cors'
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Please login to access this resource');
                    }
                    throw new Error('Failed to fetch laundry shops');
                }

                const result = await response.json();
                console.log('API Response:', result);

                const shops = result.data || [];
                const transformedShops = shops.map(shop => ({
                    id: shop.owner_id,
                    ownerName: `${shop.owner_fName} ${shop.owner_mName} ${shop.owner_lName}`,
                    contactNumber: shop.owner_contactNum,
                    address: shop.shop_address,
                    laundryName: shop.shop_name || 'N/A',
                    laundryType: shop.shop_type || 'N/A'
                }));

                console.log('Transformed shops:', transformedShops);
                setLaundryShops(transformedShops);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setLaundryShops([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLaundryShops();
    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className="bg-[#A4DCF4] bg-opacity-80 min-h-screen">
                {/* Top Bar */}
                <div className="flex justify-between items-center px-4 pt-4">
                    <Link to="/dashboard">
                        <ArrowLeft className="cursor-pointer" />
                    </Link>
                    <div className="text-right text-md md:text-lg font-medium">
                        Date: April 4, 2025
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex justify-start px-4 py-2">
                    <Input
                        type="text"
                        placeholder="Search"
                        className="w-[250px] md:w-[350px] bg-[#d8cfe5] rounded-full px-6 py-2 placeholder:text-black"
                    />
                </div>

                {/* Table Section using ShadCN UI */}
                <div className="overflow-x-auto px-4 pb-6">
                    <Table className="border-collapse">
                        <TableHeader>
                            <TableRow className="bg-[#31748f] text-white text-sm hover:bg-[#31748f]">
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">ID</TableHead>
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">Name/Owner</TableHead>
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">Contact Number</TableHead>
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">Address</TableHead>
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">Laundry Name</TableHead>
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">Type of Laundry</TableHead>
                                <TableHead className="text-white hover:bg-[#31748f] border-r border-gray-300 last:border-r-0">Action on Rows</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-red-500">{error}</TableCell>
                                </TableRow>
                            ) : laundryShops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">No laundry shops found</TableCell>
                                </TableRow>
                            ) : (
                                laundryShops.map((shop, index) => (
                                    <TableRow key={shop.id} className="bg-white text-center text-sm hover:bg-white">
                                        <TableCell className="hover:bg-white border-r border-gray-300 last:border-r-0">
                                            {shop.id}
                                        </TableCell>
                                        <TableCell className="hover:bg-white border-r border-gray-300 last:border-r-0">
                                            {shop.ownerName}
                                        </TableCell>
                                        <TableCell className="hover:bg-white border-r border-gray-300 last:border-r-0">
                                            {shop.contactNumber}
                                        </TableCell>
                                        <TableCell className="hover:bg-white border-r border-gray-300 last:border-r-0">
                                            {shop.address}
                                        </TableCell>
                                        <TableCell className="hover:bg-white border-r border-gray-300 last:border-r-0">
                                            {shop.laundryName}
                                        </TableCell>
                                        <TableCell className="hover:bg-white border-r border-gray-300 last:border-r-0">
                                            {shop.laundryType}
                                        </TableCell>
                                        <TableCell className="hover:bg-white">
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-full text-[#41748f]"
                                                    title="Edit"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-full text-[#41748f]"
                                                    title="Deactivate"
                                                >
                                                    <Power size={20} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default LaundryTable;