import React, { useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext.jsx";
import { useContext } from "react";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { backend_url , isLoggedin ,userData , getUserData } = useContext(AppContent);

  const handleInput = (e, index) => {
    const value = e.target.value;

    // Move forward if a digit is typed
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move backward on Backspace if current field is empty
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    // Handle paste of full OTP (e.g. "123456")
    const paste = e.clipboardData.getData("text").slice(0, 6);
    paste.split("").forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
    inputRefs.current[Math.min(paste.length - 1, 5)].focus();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try{
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      const {data} = await axios.post(`${backend_url}/api/auth/verify-account`, {otp}, {withCredentials: true});

      if(data.success){
        toast.success(data.message || "Email verified successfully!");
        getUserData();
        navigate("/");
      }else{
        toast.error(data.message || "Something went wrong!");
      }
    }catch(err){
      toast.error(data.message || "Something went wrong!");
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  },[isLoggedin , userData])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>
        <div className="flex justify-between mb-8">
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              required
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
            />
          ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;