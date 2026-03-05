import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const { backend_url, setIsLoggedin , getUserData} = useContext(AppContent);
  const [state, setState] = React.useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmutHandeler = async (e) => {
    try {
      e.preventDefault();

      if (state === "Sign Up") {
        const { data } = await axios.post(
          `${backend_url}/api/auth/register`,
          {
            name,
            email,
            password,
          },
          { withCredentials: true },
        );

        if (data?.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data?.message || "Something went wrong!");
        }
      } else {
        const { data } = await axios.post(
          `${backend_url}/api/auth/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          },
        );

        if (data?.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data?.message || "Something went wrong!");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmutHandeler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email id"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="lock_icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forget password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>

          <div
            className="flex gap-1 relative
           justify-center mt-4 text-sm"
          >
            <p>
              {state == "Sign Up"
                ? `Already have an account`
                : "Do not have any account "}
            </p>
            {state === "Sign Up" ? (
              <span
                onClick={() => setState("Login")}
                className="text-indigo-600 font-semibold underline cursor-pointer"
              >
                Login
              </span>
            ) : (
              <span
                onClick={() => setState("Sign Up")}
                className="text-indigo-600 font-semibold underline cursor-pointer"
              >
                Sign Up
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
