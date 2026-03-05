import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
const NavBar = () => {
  const navigate = useNavigate();
  const { userData, backend_url, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backend_url}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data?.message || "OTP sent successfully!");
      } else {
        toast.error(data?.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(data?.message || "Something went wrong!");
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backend_url}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="flex items-center justify-between w-full p-4 sm:p-6 sm:px-24 absolute z-10">
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-2 border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      )}
    </div>
  );
};

export default NavBar;
