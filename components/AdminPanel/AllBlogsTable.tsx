"use client";
import React, { useEffect } from "react";
import {
  TableContainer,
  TableRow,
  TableCell,
  Button,
  Table,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import {
  collection,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useBlogStore from "@/store/adminPanel/BlogStore";

function AllBlogsTable() {
  const { blogs, fetchBlogs } = useBlogStore();
  const router = useRouter();

  useEffect(() => {
    fetchBlogs(); // Load blogs initially
  }, []);

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return; // Confirm before deleting
    try {
      await deleteDoc(doc(db, "blogs", blogId)); // "blogs" is the Firestore collection name
      toast.success("Blog deleted successfully!");
      fetchBlogs(); // Re-fetch blogs to update the UI
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog. Please try again.");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Author Id</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Blog Title</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blogs.map((author: any) => (
            <TableRow key={author.id}>
              <TableCell>{author.id}</TableCell>
              <TableCell>{author.author}</TableCell>
              <TableCell>{author.title}</TableCell>
              <TableCell>
                {Timestamp.fromMillis(author.createdAt * 1000)
                  .toDate()
                  .toISOString()}
              </TableCell>
              <TableCell className=" flex items-center justify-center gap-2">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    router.push(`/adminPanel/Blogs/${author.id}`);
                  }}
                  className="!m-1"
                >
                  View
                </Button>

                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleDelete(author.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AllBlogsTable;
