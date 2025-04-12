import React from 'react';
import { Button } from '@/Components/ui/button';

const TournamentCard = () => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-black text-white">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Side - Phoenix */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute top-0 left-0 h-full w-full z-10">
            <div className="absolute top-10 left-6 rotate-90 text-green-500 font-bold tracking-wider">PHOENIX</div>
            <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-green-800 to-transparent opacity-20" />
          </div>
          <img 
            src="/api/placeholder/400/500" 
            alt="Gamer with headphones" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Center content */}
        <div className="w-full md:w-1/3 flex items-center justify-center p-6 text-center z-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Join The Big Tournament</h2>
            <p className="text-sm text-gray-300 mb-6">
              Welcome to Airena - The next generation streaming platform for 
              gamers and sports enthusiasts. Join our community and start 
              streaming today.
            </p>
            
            <div className="flex justify-center">
            <button
                className="bg-green-400 text-white font-bold px-16 py-2 text-xl relative"
                style={{
                  clipPath: 'polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)',
                  width: '180px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                1 vs 1
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Sage */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute top-0 right-0 h-full w-full z-10">
            <div className="absolute top-10 right-6 rotate-90 text-green-500 font-bold tracking-wider">SAGE</div>
            <div className="absolute top-0 bottom-0 right-0 w-full bg-gradient-to-l from-green-800 to-transparent opacity-20" />
          </div>
          <img 
            src="/api/placeholder/400/500" 
            alt="Professional esports player" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Background overlay effects */}
      <div className="absolute inset-0 bg-green-900 opacity-10 z-0" />
    </div>
  );
};

export default TournamentCard;