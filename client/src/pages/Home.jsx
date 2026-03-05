import React from "react";
import { useState } from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="pt-16">
        <Header />
      </div>
    </div>
  );
};

export default Home;
