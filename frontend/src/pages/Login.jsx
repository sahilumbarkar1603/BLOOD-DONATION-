import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bloodGroup: '',
        location: ''
    });
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
            // TARGET: Your Render Backend
            const response = await axios.post(
                'https://blood-donation-2-9t44.onrender.com/api/auth/register', 
                formData
            );

            if (response.data) {
                setMessage('✅ Registration Successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.error("Register Error:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || '❌ Server Error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Become a Donor</h2>
                <p className="text-center text-gray-500 mb-8">Join the community and save lives</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" name="name" placeholder="Full Name"
                        onChange={handleChange} required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                    />
                    
                    <input 
                        type="email" name="email" placeholder="Email Address"
                        onChange={handleChange} required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                    />

                    <input 
                        type="password" name="password" placeholder="Create Password"
                        onChange={handleChange} required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                    />

                    <div className="flex gap-4">
                        <select 
                            name="bloodGroup" onChange={handleChange} required
                            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition bg-white"
                        >
                            <option value="">Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>

                        <input 
                            type="text" name="location" placeholder="City"
                            onChange={handleChange} required
                            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 shadow-md'}`}
                    >
                        {loading ? 'Processing...' : 'Register Now'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <p className="text-center mt-6 text-gray-600">
                    Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;