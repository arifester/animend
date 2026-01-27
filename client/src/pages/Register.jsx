import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
                toast.warning("Password too short", {
                description: "Password must be at least 6 characters long.",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Account Created", {
                description: "Registration successful! You can now login.",
                duration: 2000,
                });
                navigate("/login");
                
            } else {
                toast.error("Registration Failed", {
                    description: data.message || "Something went wrong.",
                });
            }
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Network Error", {
                description: "Please check your internet connection.",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-xl border border-slate-800">
                <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        placeholder="Username" 
                        className="bg-slate-950 border-slate-800" 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    <Input 
                        type="email" 
                        placeholder="Email" 
                        className="bg-slate-950 border-slate-800" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        className="bg-slate-950 border-slate-800" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Register</Button>
                </form>
                <p className="text-center text-slate-500 text-sm">
                    Already have an account? <Link to="/login" className="text-indigo-400">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
