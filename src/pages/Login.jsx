import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginLocal } from "../services/auth.js";
import BgGoogle from "../assets/google.png";

function Login({setUser}){

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const navigate = useNavigate();

    const handlerLogin = async (e) => {
      e.preventDefault();
      try {
        const user = await loginLocal(email, password);
        if(user){
          setUser(user);
          navigate("/");
        }else{
          alert("Invalid Credentials");
          navigate("/login");
        }
      } catch (error) {
        
      }
    };

    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:3000/auth/google"
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back 👋</h2>
            
            <form className="space-y-5">
              <div>
                <label className="block text-gray-600 font-medium mb-1">email</label>
                <input
                  type="text"
                  value={email}
                  onChange={handleChangeEmail}
                  placeholder="youremail"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
    
              <div>
                <label className="block text-gray-600 font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handleChangePassword}
                  placeholder="********"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
    
              <button
                type="submit"
                onClick={(e) => handlerLogin(e)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
              >
                Sign In
              </button>
            </form>
    
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">or sign in with</p>
              <div className="flex justify-center mt-3 space-x-3">
                <button className="bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition" onClick={handleGoogleLogin}>
                  <img src={BgGoogle} alt="Google" className="w-6 h-6" />
                </button>
              </div>
            </div>
    
            <p className="mt-6 text-sm text-center text-gray-600">
              Don’t have an account? <a href="/signup" className="text-blue-600 hover:underline">Register</a>
            </p>
          </div>
        </div>
      )
}
export default Login;