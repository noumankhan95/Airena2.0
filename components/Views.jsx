'use client';

import React, { useState, useEffect } from 'react';
import { Eye } from "lucide-react";
import { get } from 'http';
import { getLiveViews } from '../app/lib/actions';

export default function Views({ playbackId }) {
    const [views, setViews] = useState(0);

    useEffect(() => {
        const fetchViews = async () => {
           const liveViews = getLiveViews(playbackId);
           setViews(liveViews);
        };

        fetchViews();
        
        const interval = setInterval(fetchViews, 10000); // Refresh views every 10s
        return () => clearInterval(interval);
    }, [playbackId]);

    return (
        <div className="flex items-center gap-2">
            <Eye className="text-gray-500 w-5 h-5" />
            <span className="text-white">{views}</span>
        </div>
    );
}
