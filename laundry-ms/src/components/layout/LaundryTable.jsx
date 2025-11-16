import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Eye, Search } from "lucide-react";
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
import { fetchWithApiKey } from '@/lib/api';

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

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Filters
    const [timeRange, setTimeRange] = useState("all"); // all | weekly | monthly | yearly
    const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

    useEffect(() => {
        const fetchLaundryShops = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithApiKey('/api/auth/laundry-shops');
                
                if (!response.success || !response.data) {
                    throw new Error('No data received from server');
                }

                const transformedShops = response.data.map(shop => {
                    const registeredDate = shop.date_registered ? new Date(shop.date_registered) : null;
                    return {
                        id: shop.shop_id,
                        shop_id: shop.shop_id,
                        ownerName: `${shop.owner_lName}, ${shop.owner_fName} ${shop.owner_mName}`.trim(),
                        contactNumber: shop.owner_contactNum,
                        address: shop.shop_address,
                        laundryName: shop.shop_name || 'N/A',
                        laundryType: shop.shop_type || 'N/A',
                        status: shop.shop_status,
                        dateRegistered: registeredDate ? registeredDate.toLocaleDateString() : '—',
                        registeredAt: registeredDate ? registeredDate.getTime() : null
                    };
                });

                setLaundryShops(transformedShops);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLaundryShops();
    }, []); // Remove navigate dependency since we're not using it anymore

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

    // Search function
    const handleSearch = (shop) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (shop.ownerName && shop.ownerName.toLowerCase().includes(searchLower)) ||
            (shop.laundryName && shop.laundryName.toLowerCase().includes(searchLower)) ||
            (shop.address && shop.address.toLowerCase().includes(searchLower)) ||
            (shop.contactNumber && shop.contactNumber.includes(searchTerm)) ||
            (shop.laundryType && shop.laundryType.toLowerCase().includes(searchLower))
        );
    };

    // Sort and filter shops
    const filteredLaundryShops = laundryShops
        .filter((shop) => {
            // Search filter
            if (!handleSearch(shop)) return false;
            
            // Status filter
            const statusOk = statusFilter === "all" ? true : (shop.status || "").toLowerCase() === statusFilter;
            if (!statusOk) return false;
            const threshold = getTimeThreshold();
            if (threshold === null) return true;
            if (!shop.registeredAt) return false;
            return shop.registeredAt >= threshold;
        })
        .sort((a, b) => a.ownerName.localeCompare(b.ownerName)); // Sort alphabetically by owner name

    // Get current shops for pagination
    const indexOfLastShop = currentPage * itemsPerPage;
    const indexOfFirstShop = indexOfLastShop - itemsPerPage;
    const currentShops = filteredLaundryShops.slice(indexOfFirstShop, indexOfLastShop);
    const totalPages = Math.ceil(filteredLaundryShops.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

            if (!selectedShop || !selectedShop.shop_id) {
                throw new Error('No shop selected or invalid shop ID');
            }

            const updatedData = {
                owner_fName: firstName,
                owner_mName: middleName || "",
                owner_lName: lastName,
                owner_contactNum: formFields.contactNumber,
                shop_address: formFields.address,
                shop_name: formFields.laundryName,
                shop_status: selectedShop.status || "active",
                shop_type: services.join(", ")
            };

            console.log("Sending update request:", {
                shopId: selectedShop.shop_id,
                data: updatedData
            });

            const response = await fetchWithApiKey(
                `/api/auth/edit-shop/${selectedShop.shop_id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(updatedData)
                }
            );

            if (!response.success) {
                throw new Error(response.error || 'Update failed');
            }
            
                setLaundryShops(prevShops => 
                    prevShops.map(shop => 
                        shop.shop_id === selectedShop.shop_id 
                            ? {
                                ...shop,
                                ownerName: `${updatedData.owner_lName}, ${updatedData.owner_fName} ${updatedData.owner_mName}`.trim(),
                                laundryName: updatedData.shop_name,
                                contactNumber: updatedData.owner_contactNum,
                                address: updatedData.shop_address,
                                laundryType: updatedData.shop_type,
                                status: updatedData.shop_status
                            }
                            : shop
                    )
                );
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
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]">
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page when searching
                            }}
                            placeholder="Search by shop name, owner, or address..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-[#126280] focus:outline-none transition-all duration-200"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
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
                                  <Button
                                    className="bg-[#126280] hover:bg-[#126280]/80 p-2 md:w-auto"
                                    size="icon"
                                    onClick={() => navigate('/dashboard/registerLS')}
                                  >
                                    Add Laundry Shop
                                  </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className={embedded ? "overflow-x-auto" : "overflow-x-auto px-4 pb-6"}>
                    <Table className="border-collapsee">
                        <TableHeader>
                            <TableRow className="bg-[#31748f] text-white text-sm hover:bg-[#31748f]">
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Name/Owner</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Address</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Laundry Name</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Type of Laundry</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Status</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell>
                                </TableRow>
                            ) : filteredLaundryShops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No laundry shops found</TableCell>
                                </TableRow>
                            ) : (
                                currentShops.map((shop) => (
                                    <TableRow key={shop.id} className="bg-white text-center text-sm hover:bg-white">
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.ownerName}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.address}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.laundryName}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.laundryType}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.status}</TableCell>
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
                                                        console.log('Selected shop:', shop); // Add this line
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
                
                {/* Pagination */}
                {filteredLaundryShops.length > itemsPerPage && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                        <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                            Showing <span className="font-medium">{filteredLaundryShops.length === 0 ? 0 : indexOfFirstShop + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(indexOfLastShop, filteredLaundryShops.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredLaundryShops.length}</span> results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                                className="px-3 py-1 text-sm"
                            >
                                Previous
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size="sm"
                                            className={`w-8 h-8 p-0 ${currentPage === pageNum ? 'bg-[#126280] text-white' : ''}`}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                                className="px-3 py-1 text-sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
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
