import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Pen } from "lucide-react";
async function fetchBlogs(type = "recent", page = 1, startAfter = null) {
  try {
    const query = new URLSearchParams({
      type,
      page: page.toString(),
      limit: "5",
    });
    if (startAfter) query.append("startAfter", startAfter);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchBlogsforApp?${query}`
    );

    if (!res.ok) throw new Error("Failed to fetch blogs");

    return res.json();
  } catch (e) {
    console.log(e);
  }
}

export default async function BlogPage({ searchParams }: any) {
  const params = await searchParams;
  const type = params?.type || "recent"; // Default to recent
  const page = parseInt(params?.page || "1");
  const startAfter = params?.startAfter || null;

  const { blogs, nextStartAfter } = await fetchBlogs(type, page, startAfter);
  console.log("blogs", blogs);

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", py: 6 }}>
      <Grid container spacing={4}>
        {blogs?.map((blog: any) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {blog?.createdAt &&
                    Timestamp.fromMillis(blog?.createdAt?._seconds * 1000)
                      .toDate()
                      .toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                </Typography>
                <Typography
                  variant="body2"
                  className="flex items-center justify-start"
                  sx={{ fontWeight: 400 }}
                >
                  <Pen size={12} className="mr-2" /> {"    By "} {blog.author}
                </Typography>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ mt: 2 }}
                  dangerouslySetInnerHTML={{
                    __html: blog.content.substring(0, 200),
                  }}
                />
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Link href={`/blogs/${blog.id}`} passHref>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ background: "transparent", color: "green" }}
                  >
                    Read More
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {nextStartAfter && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link
            href={`/blogs?type=${type}&page=${
              page + 1
            }&startAfter=${nextStartAfter}`}
            passHref
          >
            <Button variant="contained" color="primary">
              View More
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}
