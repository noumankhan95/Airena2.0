'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatMessage({ message }) {
    return (
        <div className={`flex flex-col items-start`}>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-amber-500">
                    {message.username}
                </span>
                <span className="text-xs text-gray-500">
                    {formatDistanceToNow(message.timestamp)}
                </span>
            </div>
            <div className='max-w-[80%] rounded-lg px-4 py-2 bg-gray-700 text-white'>
                {message.text}
            </div>
        </div>
    )
}
