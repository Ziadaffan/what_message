import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      if(err.response.status === 401){
        setError('Invalid credentials');
      }
      else{
        setError('Failed to login');
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-teal flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Login to WhatsApp</h1>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4 border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-teal focus:border-whatsapp-teal outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-whatsapp-teal focus:border-whatsapp-teal outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-whatsapp-teal hover:bg-whatsapp-dark text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-whatsapp-teal font-semibold hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
