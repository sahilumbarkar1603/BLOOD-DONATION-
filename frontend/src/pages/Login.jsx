import React, { useState } from 'react';
import { Droplet, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        // MATCHES YOUR BACKEND EXACTLY (Removed /auth)
        const response = await axios.post('https://blood-donation-2-9t44.onrender.com/api/login', { email, password });
        
        // Save the user ID so the app remembers you
        localStorage.setItem('token', response.data.user.id);
        setMessage('✅ Login Successful!');
        
        setTimeout(() => {
            navigate('/dashboard'); 
        }, 1500);

      } else {
        // MATCHES YOUR BACKEND EXACTLY (Removed /auth)
        await axios.post('https://blood-donation-mjb9.onrender.com/api/register', { name, email, password });
        setMessage('✅ Registration Successful! Please sign in.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-2">
            <Droplet className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Become a Donor'}
          </h2>
        </div>

        {message && (
          <div className={`p-3 mb-4 text-sm font-semibold rounded-lg text-center ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="John Doe" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg">
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setMessage(''); }} className="text-red-600 hover:underline text-sm font-medium">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}