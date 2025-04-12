// 'use client';

// import React from 'react';

// export default function CategoryCard({ category, streamCount }) {
//     return (
//         <div 
//             className='bg-gray-800/50 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-gray-700/50 transition duration-300'
//             onClick={() => {
//                 // Toggle visibility of streams for this category
//                 const streamsContainer = document.getElementById(`streams-${category}`);
//                 if (streamsContainer) {
//                     streamsContainer.classList.toggle('hidden');
//                 }
//             }}
//         >
//             <div className='flex items-center justify-between'>
//                 <h2 className='text-2xl font-semibold text-amber-400'>{category}</h2>
//                 <span className='text-sm text-slate-400'>
//                     {streamCount} streams
//                 </span>
//             </div>
//         </div>
//     );
// } 

'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function CategoryCard({ category, streamCount }) {
    return (
        <Card 
            className='cursor-pointer transition duration-300 hover:shadow-xl'
            sx={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', color: '#FBBF24' }}
            onClick={() => {
                // Toggle visibility of streams for this category
                const streamsContainer = document.getElementById(`streams-${category}`);
                if (streamsContainer) {
                    streamsContainer.classList.toggle('hidden');
                }
            }}
        >
            <CardContent>
                <div className='flex items-center justify-between'>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {streamCount} streams
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}
