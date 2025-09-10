import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Eye } from "lucide-react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Link, useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const LaundryTable = ({ embedded = false }) => {
    const [laundryShops, setLaundryShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [typeWashing, setTypeWashing] = useState(false);
    const [typeDryClean, setTypeDryClean] = useState(false);
    const today = format(new Date(), "MMMM dd, yyyy");
    const navigate = useNavigate();

    // Filters
    const [timeRange, setTimeRange] = useState("all"); // all | weekly | monthly | yearly
    const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

    useEffect(() => {
        const fetchLaundryShops = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/laundry-shops",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        credentials: "include",
                        mode: "cors",
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Please login to access this resource");
                    }
                    throw new Error("Failed to fetch laundry shops");
                }

                const result = await response.json();
                const shops = result.data || [];
                const transformedShops = shops.map((shop) => {
                    const rawDate = shop.createdAt || shop.created_at || shop.registrationDate || shop.registeredAt || shop.shop_createdAt || null;
                    const parsedDate = rawDate ? new Date(rawDate) : null;
                    return {
                        id: shop.owner_id,
                        ownerName: `${shop.owner_lName}, ${shop.owner_fName} ${shop.owner_mName}`,
                        contactNumber: shop.owner_contactNum,
                        address: shop.shop_address,
                        laundryName: shop.shop_name || 'N/A',
                        laundryType: shop.shop_type || 'N/A',
                        status: shop.shop_status,
                        dateRegistered: parsedDate && !isNaN(parsedDate) ? parsedDate.toLocaleDateString() : '—',
                        registeredAt: parsedDate && !isNaN(parsedDate) ? parsedDate.getTime() : null,
                    };
                });

                setLaundryShops(transformedShops);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                setLaundryShops([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLaundryShops();
    }, []);

    // Derived filters
    const getTimeThreshold = () => {
        const now = Date.now();
        switch (timeRange) {
            case "weekly":
                return now - 7 * 24 * 60 * 60 * 1000;
            case "monthly":
                return now - 30 * 24 * 60 * 60 * 1000;
            case "yearly":
                return now - 365 * 24 * 60 * 60 * 1000;
            default:
                return null;
        }
    };

    const filteredLaundryShops = laundryShops.filter((shop) => {
        const statusOk = statusFilter === "all" ? true : (shop.status || "").toLowerCase() === statusFilter;
        if (!statusOk) return false;
        const threshold = getTimeThreshold();
        if (threshold === null) return true;
        if (!shop.registeredAt) return false;
        return shop.registeredAt >= threshold;
    });

    // Handle save changes
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        
        try {
            // Validate required fields
            const formFields = {
                ownerName: e.target.ownerName.value,
                laundryName: e.target.laundryName.value,
                contactNumber: e.target.contactNumber.value,
                address: e.target.address.value
            };

            // Check for empty fields
            Object.entries(formFields).forEach(([key, value]) => {
                if (!value.trim()) {
                    throw new Error(`${key} cannot be empty`);
                }
            });

            // Get services
            const services = [];
            if (typeWashing) services.push("Washing");
            if (typeDryClean) services.push("DryClean");
            
            if (services.length === 0) {
                throw new Error("Please select at least one service type");
            }

            // Split owner name
            const [lastName, firstAndMiddle] = formFields.ownerName.split(', ');
            if (!lastName || !firstAndMiddle) {
                throw new Error("Owner name must be in format: 'LastName, FirstName MiddleName'");
            }

            const [firstName, middleName] = firstAndMiddle.split(' ');
            if (!firstName) {
                throw new Error("First name is required");
            }

            // Match the backend required fields
            const updatedData = {
                owner_fName: firstName,
                owner_mName: middleName || "",
                owner_lName: lastName,
                owner_contactNum: formFields.contactNumber,
                shop_address: formFields.address,
                shop_name: formFields.laundryName,
                shop_status: selectedShop.status || "active", // Add status
                shop_type: services.join(", ")
            };

            console.log("Sending update request:", updatedData);

            const response = await fetch(
                `http://localhost:3000/api/public/edit-shop/${selectedShop.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData)
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || `Server error: ${response.status}`);
            }

            // Update local state with the response data
            if (responseData.success && responseData.data) {
                const updatedShop = responseData.data;
                setLaundryShops(prevShops => 
                    prevShops.map(shop => 
                        shop.id === selectedShop.id 
                            ? {
                                ...shop,
                                ownerName: `${updatedShop.owner_lName}, ${updatedShop.owner_fName} ${updatedShop.owner_mName}`.trim(),
                                laundryName: updatedShop.shop_name,
                                contactNumber: updatedShop.owner_contactNum,
                                address: updatedShop.shop_address,
                                laundryType: updatedShop.shop_type,
                                status: updatedShop.shop_status
                            }
                            : shop
                    )
                );
            }

            setIsDialogOpen(false);
        } catch (error) {
            console.error("Update error:", error);
            alert(error.message);
        }
    };

    return (
        <div className={embedded ? "" : "min-h-screen bg-cover bg-center"} style={embedded ? {} : { backgroundImage: "url('/laundry-logo.jpg')" }}>
            <div className={embedded ? "" : "bg-[#A4DCF4] bg-opacity-80 min-h-screen"}>
                {/* Top Bar */}
                {!embedded && (
                    <div className="flex justify-between items-center px-4 pt-4">
                        <Link to="/dashboard">
                            <ArrowLeft className="cursor-pointer" />
                        </Link>
                        <div className="text-right text-md md:text-lg font-medium">
                            Date: {today}
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-2">
                    <div className="flex justify-start w-full md:w-auto">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="w-[250px] md:w-[350px] bg-[#d8cfe5] rounded-full px-6 py-2 placeholder:text-black"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white rounded-full px-4 py-2 text-sm text-[#126280] border border-[#126280]/30 w-full md:w-auto"
                        >
                            <option value="all">All time</option>
                            <option value="weekly">This week</option>
                            <option value="monthly">This month</option>
                            <option value="yearly">This year</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white rounded-full px-4 py-2 text-sm text-[#126280] border border-[#126280]/30 w-full md:w-auto"
                        >
                            <option value="all">All status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className={embedded ? "overflow-x-auto" : "overflow-x-auto px-4 pb-6"}>
                    <Table className="border-collapsee">
                        <TableHeader>
                            <TableRow className="bg-[#31748f] text-white text-sm hover:bg-[#31748f]">
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">ID</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Name/Owner</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Contact Number</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Address</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Laundry Name</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Type of Laundry</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Status</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Date Registered</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-red-500">{error}</TableCell>
                                </TableRow>
                            ) : filteredLaundryShops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">No laundry shops found</TableCell>
                                </TableRow>
                            ) : (
                                filteredLaundryShops.map((shop) => (
                                    <TableRow key={shop.id} className="bg-white text-center text-sm hover:bg-white">
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.id}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.ownerName}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.contactNumber}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.address}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.laundryName}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.laundryType}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.status}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.dateRegistered}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-full text-[#41748f]"
                                                    title="View"
                                                    onClick={() => navigate(`/dashboard/shops/${shop.id}`, { state: { shop } })}
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedShop(shop);
                                                        const types = (shop.laundryType || "").split(",").map(t => t.trim());
                                                        const hasWashing = types.some(type => 
                                                            type.toLowerCase() === "washing" || 
                                                            type.toLowerCase() === "wash"
                                                        );
                                                        const hasDryClean = types.some(type => 
                                                            type.toLowerCase() === "dryclean" || 
                                                            type.toLowerCase() === "dry clean" ||
                                                            type.toLowerCase() === "dry-clean"
                                                        );
                                                        setTypeWashing(hasWashing);
                                                        setTypeDryClean(hasDryClean);
                                                        setIsDialogOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-full text-[#41748f]"
                                                    title="Edit"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Edit Modal */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Laundry Shop</DialogTitle>
                            <DialogDescription>
                                Update the shop information below.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedShop && (
                            <form className="grid gap-4 py-4" onSubmit={handleSaveChanges}>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Owner</label>
                                    <Input
                                        name="ownerName"
                                        defaultValue={selectedShop.ownerName}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Laundry Name</label>
                                    <Input
                                        name="laundryName"
                                        defaultValue={selectedShop.laundryName}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Contact</label>
                                    <Input
                                        name="contactNumber"
                                        defaultValue={selectedShop.contactNumber}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Address</label>
                                    <Input
                                        name="address"
                                        defaultValue={selectedShop.address}
                                        className="col-span-3"
                                    />
                                </div>

                                {/* Type checkboxes */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Type</label>
                                    <div className="col-span-3 flex flex-col gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="washing"
                                                checked={typeWashing}
                                                onCheckedChange={(checked) => setTypeWashing(!!checked)}
                                            />
                                            <label htmlFor="washing" className="text-sm font-medium leading-none">
                                                Washing
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="dryclean"
                                                checked={typeDryClean}
                                                onCheckedChange={(checked) => setTypeDryClean(!!checked)}
                                            />
                                            <label htmlFor="dryclean" className="text-sm font-medium leading-none">
                                                DryClean
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default LaundryTable;
