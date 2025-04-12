"use client";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import CustomEmbedBlot from "./CustomBlot";
import { TextField, Button, Typography, Box, Input } from "@mui/material";
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase"; // Make sure this path is correct
import { storage } from "@/firebase"; // Assuming you have Firebase Storage set up
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const BlogEditor = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);

  const handleEmbed = () => {
    const url = prompt("Enter the social media post URL:");
    if (!url) return;

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    quill.insertEmbed(range?.index || 0, "embed", { url });

    setContent(quill.root.innerHTML);
  };
  const handleThumbnailUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };
  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Blog Title cannot be empty!");
      return;
    }

    setIsLoading(true);
    try {

      let thumbnailUrl = "";
      if (thumbnail) {
        // Upload thumbnail to Firebase Storage
        const thumbnailRef = ref(storage, `blog-thumbnails/${thumbnail.name}`);
        const uploadTask = uploadBytesResumable(thumbnailRef, thumbnail);

        // Wait for the upload to complete
        await uploadTask;

        // Get the download URL for the uploaded thumbnail
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      await addDoc(collection(db, "blogs"), {
        title,
        content,
        author,
        createdAt: serverTimestamp(),
        thumbnailUrl,
      });
      toast.success("Blog uploaded successfully!");
      setTitle("");
      setThumbnail(null)
      setContent("");
    } catch (error) {
      console.error("Error uploading blog:", error);
      toast.error("Failed to upload blog!");
    }
    setIsLoading(false);
  };

  return (
    <Box className="p-4 ">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Add Blog
      </Typography>

      {/* Blog Title Input */}
      <TextField
        label="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Add Blog
      </Typography>

      {/* Blog Title Input */}
      <TextField
        label="Blog Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        fullWidth
        margin="normal"
      />
      <div className="my-4">
        <Typography variant="h6" fontWeight="bold">
          Add Blog Thumbnail
        </Typography>
        <Input
          type="file"
          onChange={handleThumbnailUpload}
          fullWidth
          inputProps={{ accept: "image/*" }}
        />
      </div>
      {/* Blog Editor */}
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={{ toolbar: true }}
        className="text-white"
      />

      {/* Embed Button */}
      <Box className="!my-4 !mx-3 space-x-3">
        <Button
          onClick={handleEmbed}
          variant="contained"
          color="secondary"
          className="mt-2 mx-2"
        >
          Embed Social Media Post
        </Button>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={isLoading}
          className="mt-4 !mx-3"
        >
          {isLoading ? "Uploading..." : "Upload Blog"}
        </Button>
      </Box>


    </Box>
  );
};

export default BlogEditor;
