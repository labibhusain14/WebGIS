import { useState } from "react";
import { FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
    window.location.href = "/coba";
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 font-poppins">
      <div className="bg-white shadow-lg rounded-lg p-8 flex w-3/4 max-w-4xl">
        {/* Form Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 flex items-center border rounded-md px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 relative">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-4 text-right">
              <a href="#" className="text-blue-500 text-sm">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>

        {/* Illustration Section */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src="src\assets\login.png"
            alt="Login Illustration"
            className="max-w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
