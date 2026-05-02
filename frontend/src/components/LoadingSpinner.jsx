import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-none shadow-2xl"></div>
    </div>
  );
};

export default LoadingSpinner;
