import React, { useState } from 'react';
import { Droplet, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Added the steering wheel tool

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate(); // 2. Created the steering wheel constant

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        // Send Login Data to Backend
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        setMessage('✅ Login Successful!');
        
        // 3. THIS PART JUMPS TO THE DASHBOARD AFTER 1.5 SECONDS
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1500);

      } else {
        // Send Registration Data to Backend
        const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
        setMessage('✅ Registration Successful! Please sign in.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
        
        <div className="text-center mb-8">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-2">
            <Droplet className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Become a Donor'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Login to manage your profile' : 'Register to save lives'}
          </p>
        </div>

        {message && (
          <div className={`p-3 mb-4 text-sm font-semibold rounded-lg text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-left" 
                placeholder="John Doe" 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-left" 
                placeholder="you@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-left" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }} 
            className="text-red-600 hover:underline text-sm font-medium">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}