import React from "react";

const PassButton = ({ onClick, message="pass" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 pointer-events-none">
      <button
        onClick={onClick}
        className="bg-white border-2 text-black px-6 py-3 text-xl font-bold rounded-2xl shadow-lg pointer-events-auto"
      >
        {message} 
      </button>
    </div>
  );
};

export default PassButton;
