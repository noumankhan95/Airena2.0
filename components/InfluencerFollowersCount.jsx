'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { Card } from '@mui/material';

export default function InfluencerFollowersCount({ influencerId }) {
    const [followersCount, setFollowersCount] = useState(0);

    // Subscribe to followers count updates
    useEffect(() => {
        if (!influencerId) return;

        const influencerRef = doc(db, 'influencers', influencerId);
        const unsubscribe = onSnapshot(influencerRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setFollowersCount(data.followers ? data.followers.length : 0);
            }
        });

        return () => unsubscribe();
    }, [influencerId]);

    return (
        <Card className="mt-2 bg-gray-100 Card-2 rounded">Followers: {followersCount}</Card>
    );
}