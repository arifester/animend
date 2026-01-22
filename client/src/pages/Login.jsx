import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login } = useAuth(); // Global login function

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Save user and token to context & localStorage
                login(data.user, data.token);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-xl border border-slate-800 shadow-2xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        type="email" 
                        placeholder="Email Address" 
                        className="bg-slate-950 border-slate-800 focus:border-indigo-500 transition-all" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        className="bg-slate-950 border-slate-800 focus:border-indigo-500 transition-all" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-6">
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-slate-500 text-sm">
                    Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Register for free</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
