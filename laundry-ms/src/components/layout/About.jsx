import React from 'react';
import image from '../../assets/bg1.jpg'; // keep this image on the left
import { CheckSquare } from 'lucide-react';
const About = () => {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/laundry-logo.jpg')" }} // keep this as background
        >
            <div className="bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-20">
                <div className="flex justify-center items-start gap-10 px-10">

                    {/* LEFT IMAGE */}
                    <div className="relative mt-20">
                        <img
                            src={image}
                            alt="Laundry Shop"
                            className="rounded-lg shadow-lg w-full h-[400px]"
                        />
                    </div>

                    {/* TEXT OVERLAPPING IMAGE */}
                    <div className="relative -ml-20 w-[50%] z-10">
                        <div className="">
                            <h1 className="text-4xl font-bold text-black mb-5">
                                YOUR TRUSTED PARTNER
                                IN LAUNDRY CARE
                            </h1>
                            <p className="text-gray-900 mb-4">
                                we are professional and commited to providing  quality laudry and dry cleaning services.
                            </p>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
                                <CheckSquare className="w-6 h-6 text-black" />
                                Personalized Experience
                            </h1>
                            <p className="text-gray-900 ml-8 mb-4 mt-2">
                                you can always  reach us for your laundry concerns. Call or message us we are happy to help.
                            </p>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
                                <CheckSquare className="w-6 h-6 text-black" />
                                Quality
                            </h1>
                            <p className="text-gray-900 ml-8 mb-4 mt-2">
                                We take care of your clothes, Segregating the white and colored clothes, We use gentle yet
                                Effective detergents and  we’ll not damage your clothes etc.
                            </p>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
                                <CheckSquare className="w-6 h-6 text-black" />
                                Convenience
                            </h1>
                            <p className="text-gray-900 ml-8 mb-4 mt-2">
                                We assure you that none of your laundry will go missing because we count every item you send.
                                You also won’t have to wait and wonder when your laundry will be done,
                                because you’ll receive an automated message notification
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
