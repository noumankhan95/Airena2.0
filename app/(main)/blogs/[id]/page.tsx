import { adminFirestore } from "@/app/api/firebaseadmin";
import { Timestamp } from "firebase-admin/firestore";
import BlogActions from "@/components/BlogActions"; // Import the child component
import TrendingBlogs from "@/components/TrendingBlogs"; // Import the TrendingBlogs component
import { Container } from "@mui/material";

export default async function BlogPost({ params }: any) {
  const { id } = await params;
  const doc = await adminFirestore.collection("blogs").doc(id).get();

  if (!doc.exists) {
    return (
      <div className="text-center text-red-500 text-xl font-semibold">
        Blog Not Found
      </div>
    );
  }

  const blog = doc.data();

  // Convert Firestore Timestamp to a JavaScript Date string
  const serializedBlog: any = {
    ...blog,
    createdAt: blog?.createdAt
      ? new Date(blog.createdAt._seconds * 1000).toISOString()
      : null,
  };

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <Container className="flex flex-col bg-white p-6 rounded-lg shadow-md">
        {/* Title */}
        <h1 className="text-4xl lg:text-6xl font-bold uppercase leading-tight mb-4">
          {serializedBlog?.title}
        </h1>

        {/* Blog Meta Info */}
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
          <p
            className=" text-indigo-600 px-3 py-1 rounded-md font-medium"
            style={{ backgroundColor: "#06120d" }}
          >
            {new Date(serializedBlog?.createdAt).toLocaleString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-gray-500">|</p>
          <p className="text- font-medium">By {serializedBlog?.author}</p>
        </div>

        {/* Thumbnail Image */}
        {serializedBlog?.thumbnailUrl && (
          <img
            src={serializedBlog?.thumbnailUrl}
            alt="Blog Thumbnail"
            className="w-full h-auto rounded-lg shadow-md mb-6"
          />
        )}

        {/* Blog Content */}
        <div
          className="mt-4 text-lg leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: serializedBlog?.content }}
        />

        {/* Blog Actions */}
        <BlogActions id={id} blog={serializedBlog} />
      </Container>

      {/* Sidebar with Trending Blogs */}
      <div className="w-full lg:w-1/3">
        <TrendingBlogs />
      </div>
    </div>
  );
}
