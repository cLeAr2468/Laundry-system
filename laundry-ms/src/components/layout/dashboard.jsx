import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import images1 from '../../assets/pics.jpg';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen'>

                <div className="container mx-auto pt-4 px-4">
                    <Link to="/login">
                        <Button className="bg-[#126280] text-white px-8 text-lg hover:bg-[#126280]/90">
                            Log out
                        </Button>
                    </Link>
                    <div className="md:block hidden mt-10 w-full flex justify-center">
                        <img
                            src={images1}
                            alt="Laundry Shop"
                            className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                        />
                    </div>
                    <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="w-full md:w-auto text-right">
                            <div className="w-full md:w-auto text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="bg-[#126280] text-white px-8 text-lg hover:bg-[#126280]/90">
                                            Register
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="mt-2 bg-[#3D6466] text-white rounded-lg shadow-lg">
                                        <Link to="/register" className="w-full">
                                            <DropdownMenuItem onClick={() => console.log("Admin clicked")}>
                                                ADMIN
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to="/registerLS" className="w-full">
                                            <DropdownMenuItem onClick={() => console.log("Laundry Shop clicked")}>
                                                LAUNDRY SHOP
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <p className="md:text-[24px] text-[#292265] hover:text-[#292265]/90 hover:underline">
                            <a href="/laundryTable">View Registered Laundry</a>
                        </p>
                        <p className="md:text-[24px] text-[#292265] hover:text-[#292265]/90 hover:underline">
                            <a href="/userTable">View Registered Account</a>
                        </p>
                    </div>



                </div>
            </div>
        </div>
    );
};


export default Dashboard;