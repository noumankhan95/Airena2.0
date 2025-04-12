import { adminFirestore } from "../firebaseadmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const type = searchParams.get("type") || "recent"; // "recent" or "trending"

    let blogsRef = adminFirestore.collection("blogs");

    // Sorting logic: Trending (by likes) or Recent (by createdAt)
    if (type === "trending") {
      //@ts-ignore
      blogsRef = blogsRef.orderBy("likes", "desc");
    } else {
      //@ts-ignore

      blogsRef = blogsRef.orderBy("createdAt", "desc");
    }

    const snapshot = await blogsRef.limit(limit * page).get();

    const blogs = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const nextStartAfter = blogs.length ? blogs[blogs.length - 1].id : null;

    return NextResponse.json({ blogs, nextStartAfter });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
