"use client";
import React from "react";
import CategoryPills from "@/components/home/CategoryPills";
import TrendingStreams from "@/components/home/TrendingStreams";
import { useSearchParams } from "next/navigation";

function Categories() {
  const params = useSearchParams();
  const category = params.get("Category");
  return <TrendingStreams category={category || ""} />;
}

export default Categories;
