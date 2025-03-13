import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="py-2 px-20">
      <button
        onClick={() => navigate(-1)}
        className="text-xl font-bold cursor-pointer"
      >
        Back
      </button>
    </div>
  );
}

export default Header;
