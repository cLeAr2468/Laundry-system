import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-10 md:pt-20 flex items-center justify-center'>

                {/* Registration Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center ">
                    <Card className="w-full max-w-7xl shadow-lg bg-[#E4F4FC]/80">
                        <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                            <div className="flex items-center justify-center mb-2 md:mb-4 ">
                                <img
                                    src="/user.jpg"
                                    alt="Login Visual"
                                    className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] rounded-[100%]"
                                />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-center">Register</h2>

                            <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
                                <div className="space-y-2 flex-1 w-full">
                                    <Input
                                        id="Fname"
                                        type="text"
                                        placeholder="First name"
                                        className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                                <div className="space-y-2 flex-1 w-full">
                                    <Input
                                        id="Mname"
                                        type="text"
                                        placeholder="Middle name"
                                        className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                                <div className="space-y-2 flex-1 w-full">
                                    <Input
                                        id="Lname"
                                        type="text"
                                        placeholder="Last name"
                                        className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Address"
                                    className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                />
                            </div>
                            <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
                                <div className="space-y-2 w-full">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                />
                                </div>
                                <div className="space-y-2 w-full">
                                    <Input
                                        id="contact"
                                        type="tel"
                                        placeholder="Contact number"
                                        pattern="[0-9]"
                                        inputMode="numeric"
                                        maxLength={11}
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                        onInput={e => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row items-center justify-center gap-2'>
                                <div className="space-y-2 w-full">
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                                <div className="space-y-2 w-full">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                                <div className="space-y-2 w-full">
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                            </div>

                            
                            <Button className="w-full mt-2 md:mt-4 bg-[#126280] hover:bg-[#126280]/10 h-10 md:h-12 text-sm md:text-base">
                                Register
                            </Button>
                            <p className="text-sm md:text-md text-center text-gray-600 mt-2 md:mt-4">
                                Already have an account? <a href="/" className="text-blue-600 font-semibold hover:underline">Login here</a>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default Register;