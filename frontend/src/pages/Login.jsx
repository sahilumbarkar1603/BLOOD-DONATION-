import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // URL MUST MATCH YOUR RENDER BACKEND
            const response = await axios.post(
                'https://blood-donation-2-9t44.onrender.com/api/auth/login', 
                formData
            );

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setMessage('✅ Login Successful! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || '❌ Server Error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6z" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Login to your donor account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" name="email" placeholder="name@example.com"
                            onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" name="password" placeholder="••••••••"
                            onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 shadow-md'}`}
                    >
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;