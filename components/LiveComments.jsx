"use client";
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/firebase';

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
    <div className="overflow-y-auto h-full">
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
    <div className={`p-3 border-b border-gray-100 ${comment.isPinned ? 'bg-yellow-50' : ''}`}>
      <div className="flex items-start">
        <img
          src={comment.userAvatar}
          alt={comment.username}
          className="w-8 h-8 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold text-sm mr-2">
              {comment.username}
            </span>
            <span className="text-xs text-gray-500">
              {comment.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {comment.isPinned && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                Pinned
              </span>
            )}
          </div>
          <p className="text-sm mt-1 break-words">{comment.message}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <button className="flex items-center mr-3 hover:text-blue-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {comment.likes}
            </button>
            <button className="hover:text-blue-500">Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
}