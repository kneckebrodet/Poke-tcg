import React from "react";

const MessageBox = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center mb-[20vh] justify-center z-50 pointer-events-none">
      <button
        className="bg-red-600 text-white px-6 py-3 text-xl font-bold rounded-2xl shadow-lg"
      >
        {message}
      </button>
    </div>
  );
};

export default MessageBox;
