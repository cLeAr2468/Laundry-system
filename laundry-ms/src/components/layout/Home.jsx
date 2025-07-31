import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('./public/laundry-logo.jpg')" }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center text-[#126280] mb-8">
                        Welcome to Our Laundry Shop
                    </h1>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">Professional Laundry Services</h2>
                            <p className="text-gray-600">
                                We provide high-quality laundry services with care and attention to detail.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
                            <ul className="list-disc list-inside text-gray-600">
                                <li>Fast & Efficient Service</li>
                                <li>Professional Staff</li>
                                <li>Quality Guaranteed</li>
                                <li>Affordable Prices</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;