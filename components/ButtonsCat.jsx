'use client';
import { useState } from 'react';

const ToggleButtons = () => {
  const [selectedCategory, setSelectedCategory] = useState('game');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const gameSubCategories = ['Action', 'Adventure', 'RPG', 'Shooter', ];
  const sportsSubCategories = ['Football', 'Basketball', 'Tennis', 'Cricket'];

  return (
    <div className="flex flex-col items-center gap-4 bg-black p-4 w-full max-w-full ">
      <div className="flex gap-2 flex-wrap justify-center md:justify-start">
        <button
          className={`px-4 py-2 flex items-center gap-2 rounded-full border transition-all ${
            selectedCategory === 'game' ? 'bg-green-500 text-white' : 'bg-black text-gray-300 border-gray-500'
          }`}
          onClick={() => setSelectedCategory('game')}
        >
          <span className="text-sm">🎮</span> Game
        </button>
        <button
          className={`px-4 py-2 flex items-center gap-2 rounded-full border transition-all ${
            selectedCategory === 'sports' ? 'bg-white text-green-500 border-green-500' : 'bg-black text-gray-300 border-gray-500'
          }`}
          onClick={() => setSelectedCategory('sports')}
        >
          <span className="text-sm">⚽</span> Sports
        </button>
      </div>
      
      {selectedCategory === 'game' && (
        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
          {gameSubCategories.map((sub) => (
            <button
              key={sub}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedSubCategory === sub ? 'bg-green-500 text-white' : 'bg-black text-gray-300 border-gray-500'
              }`}
              onClick={() => setSelectedSubCategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
      
      {selectedCategory === 'sports' && (
        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
          {sportsSubCategories.map((sub) => (
            <button
              key={sub}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedSubCategory === sub ? 'bg-white text-green-500 border-green-500' : 'bg-black text-gray-300 border-gray-500'
              }`}
              onClick={() => setSelectedSubCategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToggleButtons;
