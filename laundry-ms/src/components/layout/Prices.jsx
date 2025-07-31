import React from 'react';

const Prices = () => {
    return (
        <div className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('./public/laundry-logo.jpg')" }}
        >
            <div className='bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center text-[#126280] mb-8">
                        Our Prices
                    </h1>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <PriceCard
                            service="Regular Wash"
                            price="$5"
                            unit="per kg"
                        />
                        <PriceCard
                            service="Dry Cleaning"
                            price="$8"
                            unit="per piece"
                        />
                        <PriceCard
                            service="Express Service"
                            price="$10"
                            unit="per kg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PriceCard = ({ service, price, unit }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{service}</h2>
        <p className="text-3xl font-bold text-[#126280]">{price}</p>
        <p className="text-gray-600">{unit}</p>
    </div>
);

export default Prices;