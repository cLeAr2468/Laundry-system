import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
             <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-10 md:pt-20'>
                <div className='container mx-auto flex flex-col md:flex-row items-center justify-evenly min-h-[500px] gap-4 md:gap-0 mx-auto px-4 md:px-[15%]'>
                    {/* Left Side - Image */}
                    <div className="hidden md:block">
                        <img
                            src="/laundry-logo.jpg"
                            alt="Login Visual"
                            className="w-[200px] md:w-[250px] h-[240px] md:h-[300px] rounded-[20%]"
                            style={{
                                boxShadow: "12px 0 20px -2px rgba(0, 0, 0, 0.6"
                            }}
                        />
                    </div>

                   <div className="w-full md:w-[440px]">
                        <Card className="w-full shadow-lg bg-[#E4F4FC]/80">
                            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                                <div className="flex items-center justify-center mb-2 md:mb-4 ">
                                    <img
                                        src="/user.jpg"
                                        alt="Login Visual"
                                        className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] rounded-[100%]"
                                    />
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-center">Login</h2>
                                <div className="space-y-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Username/Email"
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>
                                <p className="text-sm md:text-md text-gray-600 mt-2 md:mt-4 text-right font-semibold">
                                    <a href="/Forgotpassword" className="text-blue-600 hover:underline">
                                        Forgot password
                                    </a>
                                </p>

                                <Button className="w-full mt-2 md:mt-4 bg-[#126280] hover:bg-[#126280]/10 h-10 md:h-12 text-sm md:text-base">
                                    Login
                                </Button>
                                <p className="text-sm md:text-md text-center text-gray-600 mt-2 md:mt-4">
                                    Don't have an account? <a href="/register" className="text-blue-600 font-semibold hover:underline">Register</a>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;