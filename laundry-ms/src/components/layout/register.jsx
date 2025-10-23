import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchWithApiKey } from '@/lib/api'; 

// OTP Modal Component
const OTPModal = ({ open, onClose, onSubmit, onResend, resendDisabled, resendTimer }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = React.useRef([]);

    if (!open) return null;

    const handleChange = (e, idx) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);

        if (value && idx < 5) {
            inputsRef.current[idx + 1].focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputsRef.current[idx - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, 6).split("");
        const newOtp = [...otp];
        paste.forEach((char, idx) => {
            if (idx < 6) newOtp[idx] = char.replace(/[^0-9]/g, "");
        });
        setOtp(newOtp);
        const lastIdx = paste.length - 1;
        if (inputsRef.current[lastIdx]) {
            inputsRef.current[lastIdx].focus();
        }
        e.preventDefault();
    };

    // whether all OTP digits are filled
    const isOtpComplete = otp.every(d => d !== "");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <div className="flex justify-center mb-2">
                    <img
                        src="/password-access.png"
                        alt="OTP Icon"
                        className="w-14 h-14"
                    />
                </div>
                <h3 className="text-lg font-bold mb-2 text-center text-[#126280]">Account Verification</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">Please enter the OTP sent to your email.</p>
                <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => inputsRef.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(e, idx)}
                            onKeyDown={e => handleKeyDown(e, idx)}
                            className="w-10 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                        />
                    ))}
                </div>
                <div className="flex gap-2 mb-2">
                    <Button
                        className="w-full bg-[#126280] hover:bg-[#126280]/80 text-white rounded-full font-semibold"
                        onClick={() => isOtpComplete && onSubmit(otp.join(""))}
                        disabled={!isOtpComplete}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <Button
                        variant="ghost"
                        className="text-blue-600 font-semibold"
                        onClick={onResend}
                        disabled={resendDisabled}
                    >
                        Resend OTP {resendDisabled && resendTimer > 0 ? `(${resendTimer}s)` : ""}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Register = ({ embedded = false }) => {
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
    
        // Resend OTP state
        const [resendDisabled, setResendDisabled] = useState(false);
        const [resendTimer, setResendTimer] = useState(0);
    
        // Timer effect for resend button
        React.useEffect(() => {
            let timer;
            if (resendDisabled && resendTimer > 0) {
                timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            } else if (resendTimer === 0) {
                setResendDisabled(false);
            }
            return () => clearTimeout(timer);
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

        try {
            const response = await fetchWithApiKey('/api/public/register-admin', {
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
                admin_contactNum: formData.admin_contactNum.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: 'Admin',
                status: 'Active'
                })
            });

            if (response.success) {
                navigate("/dashboard");
            } else {
                setError(response.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || "Connection error. Please try again later.");
        }
        // For demo, directly show OTP modal
        setShowOTPModal(true);
        setResendDisabled(true);
        setResendTimer(30); // 30 seconds cooldown
    };

     // Dummy OTP submit handler
    const handleOTPSubmit = (otp) => {
        // Add OTP verification logic here
        setShowOTPModal(false);
        navigate("/dashboard");
    };

    // Dummy resend OTP handler
    const handleResendOTP = () => {
        // Add resend OTP logic here
        setResendDisabled(true);
        setResendTimer(30); // 30 seconds cooldown
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
                                >
                                    Register User
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
                onClose={() => setShowOTPModal(false)}
                onSubmit={handleOTPSubmit}
                onResend={handleResendOTP}
                resendDisabled={resendDisabled}
                resendTimer={resendTimer}
            />
        </div>
    );
};

export default Register;