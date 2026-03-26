import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://blood-donation-2-9t44.onrender.com/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">Login</button>
                </form>
                {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
                <p className="mt-4 text-center">New? <Link to="/register" className="text-blue-500">Register</Link></p>
            </div>
        </div>
    );
};
export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', bloodGroup: '', location: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://blood-donation-2-9t44.onrender.com/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    <input type="text" placeholder="Blood Group" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} required />
                    <input type="text" placeholder="Location" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                    <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">Register</button>
                </form>
                {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
                <p className="mt-4 text-center">Have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </div>
        </div>
    );
};
export default Register;