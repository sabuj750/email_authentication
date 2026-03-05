import React, { useRef, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const inputRefs = useRef([]);
  const [isEmailSent, setIsEmailSent] = React.useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const { backend_url } = useContext(AppContent);

  // functions

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backend_url}/api/auth/reset-password`,
        { email },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message || "OTP sent to your email id!");
        setIsEmailSent(true);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(data.message || "Something went wrong!");
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      setOtp(otpArray.join(""));
      setIsOtpSubmited(true);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };


  const onSubmitPassword = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post(`${backend_url}/api/auth/verify-reset-otp`,{email , otp , newPassword : password} , {withCredentials : true});
      if(data.success){
        data.success && navigate("/login");
        data.success && toast.success(data.message || "OTP verified successfully!");
      }else{
        toast.error(data.message || "Invalid OTP!");
      }
    }catch(err){
      toast.error("Something went wrong!");
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="size-3" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email id"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
      {/* reset otp */}
      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset verify OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
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
            Submit
          </button>
        </form>
      )}

      {/* new password */}
      {isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password and confirm it.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="size-3" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Conform password"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
