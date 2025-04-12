'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp } from "lucide-react";
import { database } from "@/firebase.js";
import { ref, onValue, off, update } from 'firebase/database';

export default function Likes({ playbackId }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const likesRef = ref(database, `likes/${playbackId}`);

        // Listen for changes in the like count
        onValue(likesRef, (snapshot) => {
            const data = snapshot.val();
            setLikes(data ? data.count : 0);
        });

        return () => off(likesRef); // Cleanup listener
    }, [playbackId]);

    const handleLike = async () => {
        const likesRef = ref(database, `likes/${playbackId}`);

        // Toggle like state
        const newLikesCount = isLiked ? likes - 1 : likes + 1;

        // Update likes in Firebase
        await update(likesRef, { count: newLikesCount });

        // Update local state
        setLikes(newLikesCount);
        setIsLiked(!isLiked);
    };

    return (
        <div className="flex items-center gap-2">
            <button onClick={handleLike} className="flex items-center gap-2" style={{ backgroundColor: "#46c190" }}>
                {isLiked ? <ThumbsUp className="text-amber-500 w-5 h-5" /> : <ThumbsUp className="text-gray-500 w-5 h-5" />}
                <span className="text-white">{likes}</span>
            </button>
        </div>
    )
}
