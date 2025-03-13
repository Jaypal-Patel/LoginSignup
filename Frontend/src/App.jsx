import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./componet/Login";
import Register from "./componet/Register";
import ForgetPassword from "./componet/ForgetPassword";
import Profile from "./pages/Profile";
import ResetPassword from "./componet/ResetPassword";
import Header from "./componet/Header";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
