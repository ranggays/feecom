import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth.js";



export default function SignUp() {


  // const [userName, setUserName] = useState("");
// const [email, setEmail] = useState("");
// const [password, setPassword] = useState("");
const [data, setData] = useState({fullName : '', email : '', password : ''});
const navigate = useNavigate();

const handlerSignUp = async (e) => {
  e.preventDefault();
  try {
    const res = await register(data);
    if (!res) {
      throw new Error("Network response was not ok");
    } else {
      navigate("/login");
    }
  } catch (error) {
    console.error("Error", error);
    alert("Error: " + error.message);
  }
}

const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/auth/google"
};

const handlerChangeUserName = (e) => {
  setData({...data, fullName: e.target.value});
}

const handlerChangeEmail = (e) => {
  // setEmail(e.target.value);
  setData({...data, email: e.target.value});
}

const handlerChangePassword = (e) => {
  // setPassword(e.target.value);
  setData({...data, password: e.target.value});
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Account 📝
        </h2>

        <form className="space-y-5" onSubmit={handlerSignUp}>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={data.fullName}
              onChange={handlerChangeUserName}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={handlerChangeEmail}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              value={data.password}
              onChange={handlerChangePassword}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">or sign up with</p>
          <div className="flex justify-center mt-3 space-x-3">
            <button className="bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition"
            onClick={handleGoogleLogin}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Iconic_Google.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
            <button className="bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Iconic_Google.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
