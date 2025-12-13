import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EditShopModal = ({ open, onClose, shop, onSave }) => {
    const [serviceList, setServiceList] = useState([]);

    useEffect(() => {
        if (shop) {
            setServiceList(
                shop.services.map(s => ({
                    service_id: s.service_id,
                    service_name: s.service_name,
                    is_displayed: s.is_displayed === "true" || s.is_displayed === 1
                }))
            );
        }
    }, [shop]);


    const toggleService = (id) => {
        setServiceList(prev => {

            const checkedCount = prev.filter(s => s.is_displayed).length;
            const toggledService = prev.find(s => s.service_id === id);

            if (!toggledService.is_displayed && checkedCount >= 3) {
                toast.warning("You can only select up to 3 services.");
                return prev;
            }

            return prev.map(s =>
                s.service_id === id ? { ...s, is_displayed: !s.is_displayed } : s
            );
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            ownerName: e.target.ownerName.value,
            laundryName: e.target.laundryName.value,
            contactNumber: e.target.contactNumber.value,
            address: e.target.address.value,
            services: serviceList.map(s => ({
                service_id: s.service_id,
                service_name: s.service_name,
                is_displayed: s.is_displayed ? "true" : "false"
            })),
        };
        onSave(formData);
    };

    if (!shop) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Laundry Shop</DialogTitle>
                    <DialogDescription>
                        Update the shop information below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Owner</label>
                        <Input
                            name="ownerName"
                            defaultValue={shop.ownerName}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Laundry Name</label>
                        <Input
                            name="laundryName"
                            defaultValue={shop.laundryName}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Contact</label>
                        <Input
                            name="contactNumber"
                            defaultValue={shop.contactNumber}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Address</label>
                        <Input
                            name="address"
                            defaultValue={shop.address}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">Type</label>

                        <div className="col-span-3 flex flex-col gap-2">
                            {serviceList.map(service => (
                                <label key={service.service_id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={service.is_displayed}
                                        onChange={() => toggleService(service.service_id)}
                                    />
                                    {service.service_name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditShopModal;
