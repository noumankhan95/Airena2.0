// "use client";
// import { useState } from 'react';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/firebase';
// import { useAuthState } from 'firebase/auth';
// import { auth } from '@/firebase';

// export default function LiveCommentInput({ influencerId, streamId }) {
//   const [commentText, setCommentText] = useState('');
//   const [user] = useAuthState(auth);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!commentText.trim() || !user || !influencerId || !streamId) return;

//     try {
//       const commentsRef = collection(
//         db, 
//         `live_comments/${influencerId}/${streamId}`
//       );
      
//       await addDoc(commentsRef, {
//         userId: user.uid,
//         username: user.displayName || 'Anonymous',
//         userAvatar: user.photoURL || '/default-avatar.png',
//         message: commentText,
//         timestamp: serverTimestamp(),
//         likes: 0,
//         isPinned: false
//       });
//       setCommentText('');
//     } catch (error) {
//       console.error("Error adding comment: ", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
//       <div className="flex items-center">
//         <input
//           type="text"
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           placeholder="Add a comment..."
//           className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           maxLength={200}
//         />
//         <button
//           type="submit"
//           disabled={!commentText.trim()}
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           Send
//         </button>
//       </div>
//     </form>
//   );
// }

'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { User } from 'lucide-react';

export default function LiveCommentInput({ influencerId, streamId }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { info: { uid: currentUserId, name: userName } } = useOwnersStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUserId) {
      router.push('/user/SignIn');
      return;
    }

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const commentsRef = collection(
        db, 
        `live_comments/${influencerId}/${streamId}`
      );
      
      await addDoc(commentsRef, {
        userId: currentUserId,
        username: userName, // Replace with actual username from your store if available
        userAvatar: '/default-avatar.png', // Replace with actual avatar if available
        message: commentText,
        timestamp: serverTimestamp(),
        likes: 0,
        isPinned: false
      });
      setCommentText('');
    } catch (error) {
      console.error("Error adding comment: ", error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <input
            type="text"
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              setError(null);
            }}
            placeholder={currentUserId ? "Add a comment..." : "Sign in to comment"}
            disabled={!currentUserId || isSubmitting}
            className={`flex-1 px-4 py-2 rounded-full border ${
              error ? 'border-red-300' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!currentUserId || !commentText.trim() || isSubmitting}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}