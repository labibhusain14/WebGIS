import { useState } from 'react';
import { FaUser, FaLock, FaEyeSlash, FaEye, FaEnvelope } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Regist from '../assets/regist.png';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('https://ggnt.mapid.co.id/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          nama: username,
          email: email,
          password: password,
          role: 'pencari',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Redirecting to login...', {
          autoClose: 2000,
          onClose: () => (window.location.href = '/login'),
        });
      } else {
        toast.error(`Registration failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 font-poppins p-4">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 flex flex-col md:flex-row w-full max-w-4xl gap-6">
        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img src={Regist} alt="Register Illustration" className="w-full max-w-xs md:max-w-full h-auto" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-3 text-center">Sign Up</h2>
          <p className="text-sm text-center text-gray-500 mb-8">Signup your free account with us</p>
          <form onSubmit={handleRegister}>
            {/* Username */}
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <FaUser className="text-gray-400 mr-3" />
              <input type="text" placeholder="Username" className="w-full focus:outline-none" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            {/* Email */}
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input type="email" placeholder="Enter your email" className="w-full focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password */}
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 relative">
              <FaLock className="text-gray-400 mr-3" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute right-4 text-gray-500 focus:outline-none" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 relative">
              <FaLock className="text-gray-400 mr-3" />
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className="w-full focus:outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button type="button" className="absolute right-4 text-gray-500 focus:outline-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-3">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 font-medium">
                Sign in
              </a>
            </p>
            <button type="submit" className="w-full bg-blue-500 text-white py-3 mt-4 rounded-lg hover:bg-blue-600 transition">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default RegisterPage;
