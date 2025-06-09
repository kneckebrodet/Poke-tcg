import React from "react";

const WaitingMessage = ({ onReshuffle }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <button
        onClick={onReshuffle}
        className="bg-red-600 text-white px-6 py-3 text-xl font-bold rounded-2xl shadow-lg"
      >
        Waiting for other player..
      </button>
    </div>
  );
};

export default WaitingMessage;
