import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "@/lib/api";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;

        if (!hash) return;

        const params = new URLSearchParams(hash.replace("#", ""));
        const access_token = params.get("access_token");


        if (!access_token) {
            console.log("No access_token found in redirect URL");
            return;
        }

        fetch(import.meta.env.VITE_SUPER_ADMIN_LOGIN, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then(async (res) => {

                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                console.log(data.token)
                toast.success(data.message);
                localStorage.setItem("supabase_token", access_token);
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            })
            .catch((err) => {
                console.error("Backend Auth Error:", err);
                toast.error("Not authorized or token expired.");
                setError("Not authorized or token expired.");
            })
            .finally(() => {
                window.history.replaceState(null, null, window.location.pathname);
            });
    }, [navigate]);


    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        toast.promise(
            (async () => {
                const response = await fetchApi('/api/public/super-admin/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                if (!response.message || !response.token) {
                    throw new Error("Invalid response from server");
                }
                const token = response.token.replace('Bearer ', '');
                localStorage.setItem("token", token);

                await new Promise((resolve) => setTimeout(resolve, 800));

                navigate("/dashboard");

                return response;
            })(),
            {
                loading: "Logging in...",
                success: "Login successful!",
                error: (err) => err.message || "Invalid credentials",
            },
        );
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/laundry-logo.jpg')" }}
        >
            <div className="bg-[#A4DCF4] bg-opacity-80 min-h-screen pt-10 md:pt-20">
                <div className="container flex flex-col md:flex-row items-center justify-evenly min-h-[500px] gap-8 md:gap-20 mx-auto px-4 md:px-[15%]">
                    {/* Left Side - Image */}
                    <div className="hidden md:block">
                        <img
                            src="/laundry-logo.jpg"
                            alt="Login Visual"
                            className="w-[200px] md:w-[250px] h-[240px] md:h-[300px] rounded-[20%]"
                            style={{
                                boxShadow: "12px 0 20px -2px rgba(0, 0, 0, 0.6)"
                            }}
                        />
                    </div>
                    <div className="w-full md:w-[440px]">
                        <Card className="w-full shadow-lg bg-[#E4F4FC]/80">
                            <CardContent className="space-y-4 p-6">
                                <div className="flex items-center justify-center mb-2 md:mb-4">
                                    <img
                                        src="/user.jpg"
                                        alt="Login Visual"
                                        className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] rounded-[100%]"
                                    />
                                </div>

                                <h2 className="text-2xl font-bold text-center">Login</h2>

                                {error && (
                                    <p className="text-red-500 text-center font-semibold">{error}</p>
                                )}

                                {/* Email/Password Login */}
                                <form onSubmit={handleLogin}>
                                    <Input
                                        type="text"
                                        placeholder="Email"
                                        className="bg-gray-300 rounded-full"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="bg-gray-300 rounded-full mt-2"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <p className="text-sm md:text-md text-gray-600 mt-2 md:mt-4 text-right font-semibold">
                                        <a href="/Forgotpassword" className="text-blue-600 hover:underline">
                                            Forgot password
                                        </a>
                                    </p>

                                    <Button
                                        type="submit"
                                        className="w-full mt-4 bg-[#126280] text-white rounded-full"
                                    >
                                        Login
                                    </Button>
                                </form>
                                {/* Google Login Button */}
                                <div className="text-center mt-4">
                                    <p className="text-sm text-gray-600 mb-2">OR</p>

                                    <Button
                                        onClick={async () => {
                                            const { data, error } = await supabase.auth.signInWithOAuth({
                                                provider: "google",
                                                options: {
                                                    redirectTo: "http://localhost:5173/login",
                                                },
                                            });

                                            if (error) {
                                                console.error(error);
                                                alert("Google login failed");
                                            }
                                        }}
                                        className="w-full flex items-center justify-center gap-2 border border-gray-300 
                                            bg-white text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-lg 
                                              shadow-sm transition-all"
                                    >
                                        <img
                                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                            alt="Google Logo"
                                            className="w-5 h-5"
                                        />
                                        <span>Sign in with Google</span>
                                    </Button>
                                    <p className="text-sm md:text-md text-center text-gray-600 mt-2 md:mt-4">
                                        <a href="/" className="text-blue-600 font-semibold hover:underline">Back to Home</a>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
