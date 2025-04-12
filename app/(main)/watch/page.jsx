import React from 'react';
import Link from 'next/link';
import { getAllStreams } from "@/app/lib/actions";
import { RadioIcon } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import Typography from '@mui/material/Typography';

export const dynamic = 'force-dynamic';

export default async function WatchPage() {
    const groupedStreams = await getAllStreams();
    console.log('Fetched streams:', groupedStreams);

    return (
        <div className='max-w-screen-xl m-auto p-4'>
            <h1 className='text-3xl font-bold p-2 border-b border-amber-300 sticky top-0 backdrop-blur-md bg-gray-800/30'>Watch Streams</h1>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                {Object.keys(groupedStreams).map((category) => (
                    <CategoryCard 
                        key={category}
                        category={category}
                        streamCount={groupedStreams[category].length}
                    />
                ))}
            </div>

            {/* Streams Display Section */}
            {Object.keys(groupedStreams).map((category) => (
                <div 
                    key={`streams-${category}`} 
                    id={`streams-${category}`}
                    className='hidden mt-6 bg-gray-800/30 rounded-xl p-4'
                >
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#FBBF24', marginBottom: '1rem' }}>
                        {category} Streams
                    </Typography>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {groupedStreams[category] && groupedStreams[category].length > 0 ? (
                            groupedStreams[category].map((stream) => (
                                <Link
                                    href={`/watch/${stream.playbackId}`}
                                    key={stream.id}
                                    className='block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition duration-300'
                                >
                                    <div className='flex items-center gap-3'>
                                        {stream.isActive ? (
                                            <RadioIcon className='text-red-600 w-6 h-6' />
                                        ) : (
                                            <RadioIcon className='text-slate-400 w-6 h-6' />
                                        )}
                                        <div className='flex flex-col'>
                                            <h3 className='text-lg font-medium text-white'>{stream.title}</h3>
                                            <p className='text-sm text-slate-300'>{stream.category}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className='text-gray-400 italic col-span-full text-center py-4'>No live streams available in this category.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
