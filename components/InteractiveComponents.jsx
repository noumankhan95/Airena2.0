'use client';

import React from 'react';
import UserQuiz from './UserQuiz';
import UserPoll from './UserPoll';

const InteractiveComponents = ({ playbackId }) => {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold'>Live Quiz</h2>
                <UserQuiz playbackId={playbackId} />
            </div>
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold'>Live Poll</h2>
                <UserPoll playbackId={playbackId} />
            </div>
        </div>
    );
};

export default InteractiveComponents;