"use client";
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/firebase';
import "@/app/globals.css"
export default function LiveComments({ influencerId, streamId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!influencerId || !streamId) return;

    const q = query(
      collection(db, `live_comments/${influencerId}/${streamId}`),
      orderBy('timestamp', 'desc'),
      limit(200) // Prevent loading too many comments at once
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching comments: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [influencerId, streamId]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading comments...</div>;

  return (
    <div className="overflow-y-auto h-full no-scrollbar">
      {comments.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}

function CommentItem({ comment }) {
  return (
    <div className={`p-3  ${comment.isPinned ? 'bg-yellow-50' : ''}`}>
      <div className="flex items-start">

        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold text-sm mr-2">
              {comment.username}
            </span>
            <span className="text-sm text-gray-500">
              {comment.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {comment.isPinned && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                Pinned
              </span>
            )}
          </div>
          <p className="text-sm mt-1 break-words text-gray-300">{comment.message}</p>

        </div>
      </div>
    </div>
  );
}