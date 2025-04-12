"use client";

import { useParams, useRouter } from "next/navigation";
import useBlogStore from "@/store/adminPanel/BlogStore";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { serverTimestamp } from "firebase/database";
import { Timestamp } from "firebase/firestore";

const BlogDetail = () => {
  const { id } = useParams();
  //@ts-ignore
  const blog = useBlogStore((state) => state.getBlogById(id as string));
  const router = useRouter();

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5">Blog not found.</Typography>
        <Button variant="contained" onClick={() => router.push("/")}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {blog.authorEmail}
          </Typography>

          {/* Render Quill HTML content safely */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />

          <Typography
            variant="caption"
            sx={{ mt: 2, display: "block", color: "gray" }}
          >
            Published:{" "}
            {
              //@ts-ignore
              Timestamp.fromMillis(blog.createdAt * 1000)
                .toDate()
                .toISOString()
            }
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlogDetail;
