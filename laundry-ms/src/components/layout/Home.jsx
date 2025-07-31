import React from 'react';
import { Button } from '../ui/button';

const Home = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('./public/laundry-logo.jpg')",
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat'
             }}
            
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-[#126280] mb-4">
                            Fresh & Clean Laundry Services
                        </h1>
                        <p className="text-xl text-gray-700 mb-8">
                            Professional Washing, Dry Cleaning & Laundry Services
                        </p>
                        <Button className="bg-[#126280] text-white px-8 py-3 text-lg">
                            Book Now
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                            <h2 className="text-2xl font-semibold mb-4 text-[#126280]">Premium Wash & Fold</h2>
                            <p className="text-gray-600 mb-4">
                                Expert washing, drying, and folding services for all your daily wear
                            </p>
                            <ul className="text-gray-600">
                                <li>✓ 24-Hour Turnaround</li>
                                <li>✓ Eco-Friendly Detergents</li>
                                <li>✓ Fabric-Specific Care</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                            <h2 className="text-2xl font-semibold mb-4 text-[#126280]">Dry Cleaning</h2>
                            <p className="text-gray-600 mb-4">
                                Professional dry cleaning for your delicate and special garments
                            </p>
                            <ul className="text-gray-600">
                                <li>✓ Stain Removal</li>
                                <li>✓ Gentle Processing</li>
                                <li>✓ Premium Finishing</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                            <h2 className="text-2xl font-semibold mb-4 text-[#126280]">Express Service</h2>
                            <p className="text-gray-600 mb-4">
                                Same-day service for your urgent laundry needs
                            </p>
                            <ul className="text-gray-600">
                                <li>✓ 6-Hour Service</li>
                                <li>✓ Priority Handling</li>
                                <li>✓ Express Delivery</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 text-center bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold text-[#126280] mb-6">Why Choose Us?</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Professional Care</h3>
                                <p className="text-gray-600">Expert handling of all fabric types</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Quick Service</h3>
                                <p className="text-gray-600">Fast turnaround times</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Quality Results</h3>
                                <p className="text-gray-600">Satisfaction guaranteed</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl mb-2">Affordable</h3>
                                <p className="text-gray-600">Competitive pricing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;