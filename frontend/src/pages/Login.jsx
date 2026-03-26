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
            const res = await axios.post('https://blood-donation-2-9t44.onrender.com/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setMessage('✅ Login Success!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || '❌ Invalid Credentials');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-gray-800">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
                    <button type="submit" disabled={loading} className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center font-medium">{message}</p>}
                <p className="mt-4 text-center">New here? <Link to="/register" className="text-red-600 font-bold">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;