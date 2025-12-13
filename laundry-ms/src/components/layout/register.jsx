import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchApi } from '@/lib/api';
import { formatPHNumber } from "@/lib/phoneFormatter";
import OTPModal from "@/components/modals/OTPModal";
import { toast } from "sonner";

const Register = ({ onClose, onSave, embedded = false }) => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        admin_fName: "",
        admin_mName: "",
        admin_lName: "",
        admin_address: "",
        admin_username: "",
        admin_contactNum: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // OTP Modal state
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [sendingOTP, setSendingOTP] = useState(false);
    const [otpResetKey, setOtpResetKey] = useState(0);


    useEffect(() => {
        let interval;

        if (resendDisabled && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendDisabled && resendTimer === 0) {
            setResendDisabled(false); // enable button when timer reaches 0
        }

        return () => clearInterval(interval);
    }, [resendDisabled, resendTimer]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const formattedNumber = formatPHNumber(formData.admin_contactNum);
        if (!formattedNumber) {
            toast.error("Invalid Philippine phone number!");
            return;
        }

        try {
            setSendingOTP(true);
            const response = await fetchApi("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });

            if (!response.success) throw new Error(response.message || "Something went wrong");

            setShowOTPModal(true);
            setResendDisabled(true);
            setResendTimer(30); // 3 mins

        } catch (err) {
            console.error("API error:", err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setSendingOTP(false);
        }
    };

    // Dummy OTP submit handler
    const handleOTPSubmit = async (otp) => {
        try {
            const verify = await fetchApi("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp })
            });

            if (!verify.success) {
                toast.error("Invalid OTP");
                return;
            }

            const formattedNumber = formatPHNumber(formData.admin_contactNum);

            const register = await fetchApi('/api/public/register-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    admin_fName: formData.admin_fName.trim(),
                    admin_mName: formData.admin_mName.trim(),
                    admin_lName: formData.admin_lName.trim(),
                    admin_address: formData.admin_address.trim(),
                    admin_username: formData.admin_username.trim(),
                    admin_contactNum: formattedNumber,
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    role: 'ADMIN',
                    status: 'ACTIVE'
                })
            });

            if (!register.success) {
                toast.error(register.message || "Failed to register customer");
                return;
            }

            toast.success(register.message || "Customer registered successfully!");
            setShowOTPModal(false);
            onSave?.("SUCCESS");
            onClose?.();
            navigate('/dashboard/users')
        } catch (error) {
            console.error("API error:", error);
            toast.error(error.message || "Something went wrong");
            setOtpResetKey(prev => prev + 1);
            setShowOTPModal(false);
        }
    };

    // Dummy resend OTP handler
    const handleResendOTP = async () => {
        try {
            setResendDisabled(true);
            setResendTimer(30);
            toast("Resending OTP...");

            const response = await fetchApi("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });

            if (!response.success) throw new Error(response.message || "Failed to resend OTP");

            toast.success("OTP resent successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to resend OTP");
            setResendDisabled(false);
        }
    };


    return (
        <div className={embedded ? "w-full" : "min-h-screen bg-cover bg-center"}
            style={embedded ? {} : {
                backgroundImage: "url('/laundry-logo.jpg')",
            }}
        >
            <div className={embedded ? "w-full" : 'bg-[#A4DCF4] bg-opacity-80 min-h-screen md:pt-5 flex items-center justify-center'}>

                {/* Registration Form */}
                <div className={`${embedded ? 'w-full' : 'w-full md:w-1/2'} flex items-center justify-center`}>
                    <div className={`w-full ${embedded ? '' : 'max-w-7xl'}`}>
                        <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src="/user.jpg"
                                    alt="User Icon"
                                    className="w-[60px] h-[60px] rounded-full border-4 border-[#126280]/20"
                                />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-[#126280] text-center mb-4">Register New User Account</h2>

                            {error && (
                                <p className="text-red-500 text-sm text-center font-semibold mb-4">
                                    {error}
                                </p>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* First row - Names */}
                                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-4'>
                                    <div className="space-y-2 flex-1 w-full">

                                        <Input
                                            id="admin_fName"
                                            type="text"
                                            placeholder="First name"
                                            value={formData.admin_fName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-300 rounded-full border border-[#126280]/30 focus:outline-none focus:ring-2 focus:ring-[#126280]/50 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 w-full">

                                        <Input
                                            id="admin_mName"
                                            type="text"
                                            placeholder="Middle name"
                                            value={formData.admin_mName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 w-full">

                                        <Input
                                            id="admin_lName"
                                            type="text"
                                            placeholder="Last name"
                                            value={formData.admin_lName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Address field */}
                                <div className="mb-4">

                                    <Input
                                        id="admin_address"
                                        type="text"
                                        placeholder="Address"
                                        value={formData.admin_address}
                                        onChange={handleChange}
                                        className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                    />
                                </div>

                                {/* Email and Contact */}
                                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-4'>
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
                                            id="admin_contactNum"
                                            type="tel"
                                            placeholder="09XXXXXXXXX"
                                            pattern="^09\d{9}$"
                                            inputMode="numeric"
                                            maxLength={11}
                                            value={formData.admin_contactNum}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            onInput={e => {
                                                let value = e.target.value.replace(/[^0-9]/g, '');
                                                if (value.length >= 2 && !value.startsWith('09')) {
                                                    value = '09' + value.slice(2);
                                                }
                                                e.target.value = value;
                                            }}
                                            required
                                            title="Please enter a valid Philippine mobile number (e.g., 09123456789)"
                                        />
                                    </div>
                                </div>

                                {/* Username and Passwords */}
                                <div className='flex flex-col md:flex-row items-center justify-center gap-4 mb-6'>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="admin_username"
                                            type="text"
                                            placeholder="Username"
                                            value={formData.admin_username}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 w-full">

                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="bg-gray-300 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base h-10 md:h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-6 bg-[#126280] hover:bg-[#126280]/80 h-10 md:h-12 text-sm md:text-base text-white rounded-full font-semibold"
                                    disabled={sendingOTP}
                                >
                                    {sendingOTP ? "Sening OTP..." : <>Register User</>}
                                </Button>
                            </form>

                            {!embedded && (
                                <p className="text-sm md:text-md text-center text-gray-600 mt-2 md:mt-4">
                                    <a href="/dashboard" className="text-blue-600 font-semibold hover:underline text-lg">Back</a>
                                </p>
                            )}
                        </CardContent>
                    </div>
                </div>
            </div>
            {/* OTP Modal */}
            <OTPModal
                open={showOTPModal}
                onClose={() => {
                    setOtpResetKey(prev => prev + 1);
                    setShowOTPModal(false);
                }}
                onSubmit={handleOTPSubmit}
                onResend={handleResendOTP}
                resendDisabled={resendDisabled}
                resendTimer={resendTimer}
                resetTrigger={otpResetKey}
            />
        </div>
    );
};

export default Register;