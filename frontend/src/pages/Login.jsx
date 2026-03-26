import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // 1. Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. The Main Login Function
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload
        setMessage('Connecting to server...');

        try {
            // TARGET: Your Render Backend
            const response = await axios.post(
                'https://blood-donation-2-9t44.onrender.com/api/auth/login', 
                formData
            );

            if (response.data.token) {
                // Save the "Secret Key" (Token) so the user stays logged in
                localStorage.setItem('token', response.data.token);
                setMessage('Login Successful! Redirecting...');
                
                // Move to Dashboard after 1 second
                setTimeout(() => navigate('/dashboard'), 1000);
            }
        } catch (error) {
            console.error("Login Error Details:", error.response || error);
            const errorMsg = error.response?.data?.message || 'Server Error. Check your connection.';
            setMessage(errorMsg);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Login to LifeDrop</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" name="email" placeholder="Email" 
                    onChange={handleChange} required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
                />
                <input 
                    type="password" name="password" placeholder="Password" 
                    onChange={handleChange} required 
                    style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', color: message.includes('Successful') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default Login;