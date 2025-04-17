"use client";

import { useState } from "react";
import { storage, db } from "@/firebase"; // Adjust according to your Firebase setup
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { useVideoStore } from "@/store/influencerPanel/videoStore"; // Zustand store
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";

export default function UploadVideo() {
  const { videoFile, setVideoFile, thumbnail, setThumbnail } = useVideoStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const { uid, name } = useInfluencersInfo();
  const handleFileChange = (e: any) => {
    if (e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: any) => {
    if (e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Please select a video to upload.");
      return;
    }
    if (!uid) {
      toast.error("You Must be Logged in to perform this action");
      return;
    }
    const toastId = toast.loading("Uploading video...");
    setUploading(true);

    try {
      // Upload video to Firebase Storage
      const videoRef = ref(storage, `savedVideos/${uid}/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(videoRef, videoFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.update(toastId, {
            render: `Uploading: ${Math.round(progress)}%`,
            isLoading: true,
          });
        },
        (error) => {
          console.error("Upload error:", error);
          toast.update(toastId, {
            render: "Upload failed!",
            type: "error",
            isLoading: false,
          });
          setUploading(false);
        },
        async () => {
          try {
            const videoURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Upload thumbnail if available
            let thumbnailURL = "";
            if (thumbnail) {
              const thumbRef = ref(
                storage,
                `savedThumbnails/${uid}/${thumbnail.name}`
              );
              const thumbSnapshot = await uploadBytesResumable(
                thumbRef,
                thumbnail
              );
              thumbnailURL = await getDownloadURL(thumbSnapshot.ref);
            }

            // Save video details in Firestore
            const userDocRef = doc(db, "savedStreams", uid); // Reference to user document

            // Fetch existing document
            const docSnap = await getDoc(userDocRef);
            const newStream = {
              title,
              description,
              category,
              visibility,
              tags: tags.split(",").map((tag) => tag.trim()), // Convert comma-separated tags to array
              videoURL,
              thumbnailURL,
              createdAt: new Date().toISOString(),
              name,
            };
            if (!docSnap.exists()) {
              // If user document doesn't exist, create it with the first stream
              await setDoc(userDocRef, {
                streams: [newStream], // Store the first stream in an array
              });
            } else {
              // Append new stream without overwriting existing ones
              await updateDoc(userDocRef, {
                streams: arrayUnion(newStream),
              });
            }

            // Usage Example

            toast.update(toastId, {
              render: "Upload successful!",
              type: "success",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });

            // Reset form
            setTitle("");
            setDescription("");
            setCategory("");
            setTags("");
            setVideoFile(null);
            setThumbnail(null);
          } catch (error) {
            console.error("Error saving video to Firestore:", error);
            toast.update(toastId, {
              render: "Error saving video!",
              type: "error",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });
          } finally {
            setUploading(false);
          }
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.update(toastId, {
        render: "Unexpected error occurred!",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      setUploading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ bgcolor: "#000", color: "white", py: 4, my: 5 }}
      className="rounded-md"
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
        Upload Video
      </Typography>
      <Typography variant="subtitle1" textAlign="center" mb={4}>
        Share your content with your audience
      </Typography>

      {/* Video Upload */}
      <Box
        sx={{
          border: "2px dashed gray",
          borderRadius: "8px",
          height: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: "#111",
          mb: 3,
        }}
        component="label"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("video/")) {
            handleFileChange({ target: { files: [file] } });
          }
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 40, mb: 1, color: "gray" }} />
        <Typography variant="body2" color="gray">
          Drag and drop video files or Browse
        </Typography>
        <Typography variant="caption" color="gray">
          MP4, WebM, or OGG (Maximum 4GB)
        </Typography>
        <input
          type="file"
          hidden
          accept="video/*"
          onChange={handleFileChange}
        />
      </Box>
      {videoFile && (
        <Typography variant="caption" color="gray" sx={{ my: 2 }}>
          Selected: {videoFile.name}
        </Typography>
      )}
      {/* Video Title */}
      <TextField
        fullWidth
        label="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          borderRadius: "5px",
          mb: 3,
          input: { color: "white" },
        }}
      />

      {/* Description */}
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{
          borderRadius: "5px",
          mb: 3,
          input: { color: "white" },
        }}
      />
      <Box
        sx={{
          border: "2px dashed gray",
          borderRadius: "8px",
          height: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: "#111",
          mb: 3,
        }}
        component="label"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("image/")) {
            handleThumbnailChange({ target: { files: [file] } });
          }
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 40, mb: 1, color: "gray" }} />
        <Typography variant="body2" color="gray">
          Drag and drop Thumbnails or Browse
        </Typography>
        <Typography variant="caption" color="gray">
          Upload Thumbnail
        </Typography>
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </Box>
      {thumbnail && (
        <Box mt={1} display="flex" alignItems="center" gap={2} sx={{ my: 2 }}>
          <img
            src={URL.createObjectURL(thumbnail)}
            alt="Thumbnail Preview"
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
              objectFit: "cover",
            }}
          />
          <Typography variant="caption" color="gray">
            {thumbnail.name}
          </Typography>
        </Box>
      )}
      {/* Category Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: "gray" }}>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ bgcolor: "#222", color: "white", borderRadius: "5px" }}
        >
          <MenuItem value="">Select a category</MenuItem>
          <MenuItem value="gaming">Gaming</MenuItem>
          <MenuItem value="sports">Sports</MenuItem>
        </Select>
      </FormControl>

      {/* Tags */}
      <TextField
        fullWidth
        label="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        sx={{
          borderRadius: "5px",
          mb: 3,
          input: { color: "white" },
        }}
      />

      {/* Visibility Options */}
      <RadioGroup
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
      >
        <FormControlLabel
          value="public"
          control={<Radio sx={{ color: "white" }} />}
          label="Public - Everyone can watch"
        />
        <FormControlLabel
          value="unlisted"
          control={<Radio sx={{ color: "white" }} />}
          label="Unlisted - Anyone with the link can watch"
        />
        <FormControlLabel
          value="private"
          control={<Radio sx={{ color: "white" }} />}
          label="Private - Only you can watch"
        />
      </RadioGroup>

      {/* Upload Button */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="contained" disabled={uploading} onClick={handleUpload}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Box>
    </Container>
  );
}
