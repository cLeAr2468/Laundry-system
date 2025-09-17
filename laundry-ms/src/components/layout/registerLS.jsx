import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";

const RegisterLS = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    laundryShopName: "",
    services: {
      washing: false,
      dryClean: false,
    },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [id]: !prev.services[id],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        // Transform services into string
        const selectedServices = [];
        if (formData.services.washing) selectedServices.push("Washing");
        if (formData.services.dryClean) selectedServices.push("DryClean");

        // Prepare the data in the format expected by the backend
        const registrationData = {
            owner_fName: formData.firstName,
            owner_mName: formData.middleName,
            owner_lName: formData.lastName,
            owner_emailAdd: formData.email,
            owner_contactNum: formData.contact,
            shop_address: formData.address,
            shop_name: formData.laundryShopName,
            shop_type: selectedServices.join(", "),
        };

        console.log('Sending registration data:', registrationData);

        const response = await fetch('http://localhost:3000/api/public/register-laundry-shop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });

        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to register laundry shop');
        }

        // Registration successful
        navigate('/dashboard');
    } catch (error) {
        console.error('Registration error:', error);
        setError(error.message);
    }
};

  return (
    <div
      className={embedded ? "w-full" : "min-h-screen bg-cover bg-center"}
      style={embedded ? {} : {
        backgroundImage: "url('/laundry-logo.jpg')",
        backgroundSize: "contain",
        backgroundRepeat: "repeat",
      }}
    >
      <div className={embedded ? "w-full" : "bg-[#A4DCF4] bg-opacity-80 min-h-screen md:pt-5 flex items-center justify-center"}>
        <div className={`${embedded ? 'w-full' : 'w-full md:w-1/2'} flex items-center justify-center`}>
          <div className={`w-full ${embedded ? '' : 'max-w-7xl'}`}>
            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
              <div className="flex items-center justify-center mb-4  max-w-2xl mx-auto">
               <ShoppingBasket />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#126280] text-center mb-4">
                Register New Laundry Shop
              </h2>

              {error && (
                <p className="text-red-500 text-sm text-center font-semibold">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                  <div className="space-y-2 flex-1 w-full">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <Input
                      id="middleName"
                      type="text"
                      placeholder="Middle name"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                    />
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-4">
                  <div className="space-y-2 w-full">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2 w-full">
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="Contact number"
                      pattern="09[0-9]{9}"
                      value={formData.contact}
                      onChange={handleChange}
                      className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full mt-4">
                  <Input
                    id="address"
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-4">
                  <div className="space-y-2 w-full">
                    <Input
                      id="laundryShopName"
                      type="text"
                      placeholder="Laundry Shop Name"
                      value={formData.laundryShopName}
                      onChange={handleChange}
                      className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="bg-white rounded-2xl p-4 border border-[#126280]/30">
                      <p className="text-sm font-medium mb-2 text-[#126280]">
                        Type of Laundry Services
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="washing"
                            checked={formData.services.washing}
                            onCheckedChange={() =>
                              handleCheckboxChange("washing")
                            }
                          />
                          <label
                            htmlFor="washing"
                            className="text-sm font-medium leading-none"
                          >
                            Washing
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dryClean"
                            checked={formData.services.dryClean}
                            onCheckedChange={() =>
                              handleCheckboxChange("dryClean")
                            }
                          />
                          <label
                            htmlFor="dryClean"
                            className="text-sm font-medium leading-none"
                          >
                            Dry Clean
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full mt-6 bg-[#126280] hover:bg-[#126280]/80 h-10 md:h-12 text-sm md:text-base text-white rounded-full font-semibold"
                >
                  Register Laundry Shop
                </Button>
              </form>

              {!embedded && (
                <p className="text-sm md:text-md text-center text-gray-600 mt-2 md:mt-4">
                  <a
                    href="/dashboard"
                    className="text-blue-600 font-semibold hover:underline text-lg"
                  >
                    Back
                  </a>
                </p>
              )}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLS;
