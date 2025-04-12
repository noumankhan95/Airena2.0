"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
export default function BlogFilter({ selectedType }: { selectedType: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(selectedType);

  useEffect(() => {
    setActiveTab(selectedType);
  }, [selectedType]);

  const handleSwitch = (type: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("type", type);
    newParams.delete("startAfter"); // Reset pagination on switch
    router.push(`/blogs?${newParams.toString()}`);
  };

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        variant="contained"
        onClick={() => handleSwitch("recent")}
        className={`px-4 py-2 rounded-lg ${
          activeTab === "recent" ? "bg-indigo-600 text-white" : "bg-gray-200"
        }`}
      >
        Recent Blogs
      </Button>
      <Button
        variant="contained"
        onClick={() => handleSwitch("trending")}
        className={`px-4 py-2 rounded-lg ${
          activeTab === "trending" ? "bg-indigo-600 text-white" : "bg-gray-200"
        }`}
      >
        Trending Blogs
      </Button>
    </div>
  );
}
