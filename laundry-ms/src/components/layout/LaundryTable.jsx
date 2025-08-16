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

const LaundryTable = () => {
    const [laundryShops, setLaundryShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [typeWashing, setTypeWashing] = useState(false);
    const [typeDryClean, setTypeDryClean] = useState(false);
    const today = format(new Date(), "MMMM dd, yyyy");

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
                const transformedShops = shops.map((shop) => ({
                    id: shop.owner_id,
                    ownerName: `${shop.owner_lName}, ${shop.owner_fName} ${shop.owner_mName}`,
                    contactNumber: shop.owner_contactNum,
                    address: shop.shop_address,
                    laundryName: shop.shop_name || 'N/A',
                    laundryType: shop.shop_type || 'N/A',
                    status: shop.shop_status || 'active',
                }));

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

    // Handle save changes
    const handleSaveChanges = (e) => {
        e.preventDefault();

        const updatedType = [
            typeWashing ? "Washing" : null,
            typeDryClean ? "DryClean" : null
        ].filter(Boolean).join(", ");

        const updatedData = {
            ...selectedShop,
            laundryType: updatedType
        };

        console.log("Saving changes:", updatedData);
        // TODO: API call for updating
        setIsDialogOpen(false);
    };

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
                        Date: {today}
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

                {/* Table Section */}
                <div className="overflow-x-auto px-4 pb-6">
                    <Table className="border-collapse">
                        <TableHeader>
                            <TableRow className="bg-[#31748f] text-white text-sm hover:bg-[#31748f]">
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">ID</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Name/Owner</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Contact Number</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Address</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Laundry Name</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Type of Laundry</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Status</TableHead>
                                <TableHead className="text-white border-r border-gray-300 last:border-r-0">Action on Rows</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-red-500">{error}</TableCell>
                                </TableRow>
                            ) : laundryShops.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">No laundry shops found</TableCell>
                                </TableRow>
                            ) : (
                                laundryShops.map((shop) => (
                                    <TableRow key={shop.id} className="bg-white text-center text-sm hover:bg-white">
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.id}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.ownerName}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.contactNumber}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.address}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.laundryName}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.laundryType}</TableCell>
                                        <TableCell className="border-r border-gray-300 last:border-r-0">{shop.status}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedShop(shop);
                                                        console.log("Original laundry type:", shop.laundryType);
                                                        const types = (shop.laundryType || "").split(",").map(t => t.trim());
                                                        console.log("Parsed types:", types);
                                                        
                                                        // Check for washing (case insensitive)
                                                        const hasWashing = types.some(type => 
                                                            type.toLowerCase() === "washing" || 
                                                            type.toLowerCase() === "wash"
                                                        );
                                                        
                                                        // Check for dryclean (case insensitive)
                                                        const hasDryClean = types.some(type => 
                                                            type.toLowerCase() === "dryclean" || 
                                                            type.toLowerCase() === "dry clean" ||
                                                            type.toLowerCase() === "dry-clean"
                                                        );
                                                        
                                                        console.log("Has washing:", hasWashing);
                                                        console.log("Has dryclean:", hasDryClean);
                                                        
                                                        setTypeWashing(hasWashing);
                                                        setTypeDryClean(hasDryClean);
                                                        setIsDialogOpen(true);
                                                    }}
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
                                        defaultValue={selectedShop.ownerName}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Laundry Name</label>
                                    <Input
                                        defaultValue={selectedShop.laundryName}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Contact</label>
                                    <Input
                                        defaultValue={selectedShop.contactNumber}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Address</label>
                                    <Input
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
