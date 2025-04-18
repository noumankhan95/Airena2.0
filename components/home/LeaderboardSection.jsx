import React from 'react';

const leaderboardData = [
  { rank: '# 1', player: 'ProGamer123', score: 2500, prize: '$10,000' },
  { rank: '# 2', player: 'StreamKing', score: 2350, prize: '$5,000' },
  { rank: '# 3', player: 'GameMaster', score: 2200, prize: '$2,500' },
  { rank: '# 4', player: 'ElitePlayer', score: 2100, prize: '$1,000' },
  { rank: '# 5', player: 'TopStreamer', score: 2000, prize: '$500' },
];

const LeaderboardSection = () => {
  return (
    <div className="bg-black text-white p-3 sm:p-4 md:p-6 w-full lg:w-1/2">
      <div className=" mx-auto">


        {/* Table with border gradient effect */}
        <div className="relative">
          {/* Glow effect around table borders */}
          <div className="absolute -inset-1 bg-green-800/30 blur-md rounded-lg" />

          <div className="relative overflow-x-auto rounded-lg bg-black border border-gray-800/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-black/80">
                  <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium">Rank</th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium">Player</th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium">Score</th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-medium">Prize</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {leaderboardData.map((item, index) => (
                  <tr
                    key={index}
                    className={`${index < 3 ? 'bg-green-900/20' : ''}`}
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                      <span className={`${index < 3 ? 'text-green-400' : 'text-gray-400'} text-xs sm:text-sm font-medium`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm">{item.player}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-xs sm:text-sm">
                      <span className="text-green-400">{item.score}</span>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-right text-xs sm:text-sm font-medium">
                      {item.prize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;