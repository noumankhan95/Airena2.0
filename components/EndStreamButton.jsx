'use client';

import React, { useState } from 'react';
import { endStream } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

export default function EndStreamButton({ streamId }) {
    const [isEnding, setIsEnding] = useState(false);
    const router = useRouter();

    const handleEndStream = async () => {
        if (!confirm('Are you sure you want to end this stream?')) {
            return;
        }

        setIsEnding(true);
        try {
            const result = await endStream(streamId);
            if (result.success) {
                alert('Stream ended successfully');
                router.push('/influencerPanel');
                router.refresh();
            } else {
                alert('Failed to end stream: ' + result.error);
            }
        } catch (error) {
            alert('Error ending stream: ' + error.message);
        } finally {
            setIsEnding(false);
        }
    };

    return (
        <button
            onClick={handleEndStream}
            disabled={isEnding}
            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
        >
            {isEnding ? (
                <>
                    <span className='animate-spin'>⏳</span>
                    Ending Stream...
                </>
            ) : (
                'End Stream'
            )}
        </button>
    );
} 