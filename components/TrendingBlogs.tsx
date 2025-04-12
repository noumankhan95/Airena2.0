"use client";
import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, Link, Avatar } from "@mui/material";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";

const TrendingBlogs = () => {
  const [trendingBlogs, setTrendingBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("likes", "desc"), limit(10)); // Assuming "likes" is the field you are sorting by

        const snapshot = await getDocs(q);
        const blogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrendingBlogs(blogs);
      } catch (error) {
        console.error("Error fetching trending blogs:", error);
      }
    };

    fetchTrendingBlogs();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
        Trending Blogs
      </Typography>
      <List>
        {trendingBlogs.map((blog) => (
          <ListItem
            key={blog.id}
            sx={{
              marginBottom: 2,
              display: "flex",
              flexDirection: "column", // Stack the thumbnail and title vertically
              alignItems: "start", // Center the content horizontally
              textAlign: "start", // Ensure the title is centered
            }}
            className="border-b-2 border-b-gray-700 rounded-none"
          >
            {blog.thumbnailUrl && (
              <Avatar
                src={blog.thumbnailUrl}
                alt="thumbnail"
                variant="rounded"
                sx={{
                  width: 120, // Enlarged thumbnail size
                  height: 120,
                  marginBottom: 1, // Space between thumbnail and title
                }}
              />
            )}
            <Link
              href={`/blogs/${blog.id}`}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.1rem", // Slightly larger font size for the title
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {blog.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TrendingBlogs;
