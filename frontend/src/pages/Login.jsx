import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // API calls now go to the same Vercel domain (serverless functions)
  const API_URL = '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('⏳ Connecting to server...');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin 
        ? { email: email.toLowerCase(), password } 
        : { name, email: email.toLowerCase(), password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (isLogin) {
        const userId = response.data.user?.id || response.data.user?._id;
        localStorage.setItem('token', userId);
        
        setMessage('✅ Login Successful!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage('✅ Registration Successful! Please sign in.');
        setIsLogin(true);
        setPassword(''); // Clear password for safety
      }
    } catch (error) {
      console.error("Error details:", error);
      
      if (error.response) {
        // The server connected, but password was wrong or user exists
        setMessage(`❌ ${error.response.data.message || 'Something went wrong'}`);
      } else {
        // The dreaded Network Error (Server is asleep)
        setMessage('❌ Network Error: Server is waking up. Please wait 30 seconds and click again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🩸
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h2>
        </div>

        {message && (
          <div className={`p-3 rounded mb-4 text-sm text-center font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700' : message.includes('⏳') ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 transition duration-200"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
            className="text-red-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;