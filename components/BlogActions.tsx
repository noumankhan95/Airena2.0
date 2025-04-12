"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";

export default function BlogActions({ id, blog }: { id: string; blog: any }) {
  const {
    info: { uid: user, name },
  } = useOwnersStore();
  const [liked, setLiked] = useState(blog.likes?.includes(user) || false);
  const [isLiking, setIsLiking] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState(blog.comments || []);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a blog!");
      return;
    }

    setIsLiking(true);
    try {
      const docRef = doc(db, "blogs", id);
      let updatedLikes = [...(blog.likes || [])];

      if (liked) {
        await updateDoc(docRef, { likes: arrayRemove(user) });
        updatedLikes = updatedLikes.filter((uid) => uid !== user);
      } else {
        await updateDoc(docRef, { likes: arrayUnion(user) });
        updatedLikes.push(user);
      }

      setLiked(!liked);
      blog.likes = updatedLikes; // Update blog likes in UI
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
      toast.error("Failed to update like!");
    }
    setIsLiking(false);
  };

  const handleComment = async () => {
    if (!user) {
      toast.error("You must be logged in to comment!");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    setIsCommenting(true);
    try {
      const docRef = doc(db, "blogs", id);
      const newComment = {
        userId: user,
        displayName: name,
        text: comment,
        createdAt: new Date().toISOString(),
      };

      await updateDoc(docRef, {
        comments: arrayUnion(newComment),
      });

      //@ts-ignore
      setComments((prev) => [...prev, newComment]);
      setComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment!");
    }
    setIsCommenting(false);
  };

  return (
    <div className="mt-6">
      {/* Like Button */}
      <Button
        onClick={handleLike}
        variant="contained"
        color={liked ? "secondary" : "primary"}
        disabled={isLiking}
        className="mt-4"
      >
        {liked ? "Unlike" : "Like"} ({blog.likes?.length || 0})
      </Button>

      {/* Comment Section */}
      <Typography variant="h5" className="mt-6">
        Comments
      </Typography>

      {comments.length ? (
        //@ts-ignore

        comments.map((cmt, index) => (
          <div key={index} className="mt-2 p-2 border rounded">
            <p className="font-semibold">{cmt.displayName}</p>
            <p className="text-gray-700">{cmt.text}</p>
            <p className="text-xs text-gray-500">
              {new Date(cmt.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {/* Add Comment Input */}
      <div className="mt-4 flex gap-2">
        <TextField
          label="Add a comment"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          onClick={handleComment}
          variant="contained"
          color="primary"
          disabled={isCommenting}
        >
          {isCommenting ? "Adding..." : "Comment"}
        </Button>
      </div>
    </div>
  );
}
