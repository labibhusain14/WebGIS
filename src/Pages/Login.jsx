import { useState } from 'react';
import { FaEnvelope, FaLock, FaEyeSlash, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginIllustration from '../assets/login.png';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://ggnt.mapid.co.id/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // ✅ Simpan token dan data user ke localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      toast.success('Login berhasil!', {
        position: 'top-center',
      });

      setTimeout(() => {
        window.location.href = '/home';
      }, 1500);
    } catch {
      toast.error('Email atau password salah!', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 font-poppins p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row w-full max-w-4xl">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input type="email" placeholder="Enter your email" className="w-full focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 relative">
              <FaLock className="text-gray-400 mr-3" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute right-4 text-gray-500 focus:outline-none" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-4 text-right">
              <a href="#" className="text-blue-500 text-sm">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Belum punya akun?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Daftar
            </a>
          </p>
        </div>

        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
          <img src={loginIllustration} alt="Login Illustration" className="max-w-full h-auto" />
        </div>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default LoginPage;
