import React from 'react';

const Services = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('./public/laundry-logo.jpg')" }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center text-[#126280] mb-8">
                        Our Services
                    </h1>
                    <div className="grid md:grid-cols-3 gap-6">
                        <ServiceCard
                            title="Wash & Fold"
                            description="Professional washing and folding service for your everyday clothes."
                        />
                        <ServiceCard
                            title="Dry Cleaning"
                            description="Expert dry cleaning for your delicate and special garments."
                        />
                        <ServiceCard
                            title="Express Service"
                            description="Same-day service for urgent laundry needs."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServiceCard = ({ title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default Services;