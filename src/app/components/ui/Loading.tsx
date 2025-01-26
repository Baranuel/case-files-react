
import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2c2420] bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#ECD5B8] border-t-transparent rounded-full animate-spin" 
             role="progressbar" 
             aria-label="Loading">
        </div>
        <p className="text-[#ECD5B8] text-lg font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};
