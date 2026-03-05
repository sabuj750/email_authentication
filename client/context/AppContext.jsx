import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backend_url = https://email-authentication-backend-ixvx.onrender.com;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);
  const getAuthState = async () => {
    try{
      const { data } = await axios.get(`${backend_url}/api/auth/is-auth`, { withCredentials: true })

      if(data?.success){
        setIsLoggedin(true);
        getUserData();
      }
    }catch(err){
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  }

    const getUserData = async () => {
      try{
        const { data } = await axios.get(`${backend_url}/api/user/data`, { withCredentials: true })
        if(data?.success){
          setUserData(data.userData);
        }else{
          toast.error(data?.message || "Something went wrong!");
        }
      }catch(err){
         toast.error(err?.response?.data?.message || "Something went wrong!");
      }
    }

    useEffect(() => {
      getAuthState();
    },[])

  const value = {
    backend_url,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
