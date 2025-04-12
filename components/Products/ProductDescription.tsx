// app/components/ProductDescription.tsx
"use client";

export default function ProductDescription({ html }: any) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
