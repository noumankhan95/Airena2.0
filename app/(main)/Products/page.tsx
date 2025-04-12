// export const revalidate = 10;
// import ProductDescription from "@/components/Products/ProductDescription";

// export default async function ProductsPage({ searchParams }: any) {
//   const first = 10;
//   const after = (await searchParams)?.after || null;
//   const apiUrl = after
//     ? `${
//         process.env.NEXT_PUBLIC_BASE_URL
//       }/api/fetchProductsForApp?after=${encodeURIComponent(after)}`
//     : `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchProductsForApp`;

//   const res = await fetch(apiUrl);
//   if (!res.ok) throw new Error("Failed to fetch products");
//   const data = await res.json();
//   console.log(data);
//   const products = data?.edges?.map((edge: any) => edge.node) || [];
//   const nextCursor = data?.pageInfo?.hasNextPage
//     ? data?.pageInfo?.endCursor
//     : null;

//   return (
//     <div className="container mx-auto px-6 py-12">
//       <h1 className="text-4xl font-bold text-center mb-10 text-gray-100">
//         Our Products
//       </h1>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {products.map((product: any) => {
//           const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${product.handle}`;

//           return (
//             <div
//               key={product.id}
//               className="group  border border-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {/* Product Image */}
//               <a href={productUrl} target="_blank" rel="noopener noreferrer">
//                 <img
//                   src={product.images?.edges[0]?.node?.url}
//                   alt={
//                     product.images?.edges[0]?.node?.altText || "Product Image"
//                   }
//                   className="w-full h-56 object-cover transition-opacity duration-300 group-hover:opacity-80"
//                 />
//               </a>

//               {/* Product Details */}
//               <div className="p-5">
//                 <h2 className="text-2xl font-semibold text-gray-100 mb-2">
//                   {product.title}
//                 </h2>

//                 {/* Collapsible Product Description */}
//                 <details className="mb-4">
//                   <summary className="cursor-pointer text-indigo-400 font-medium hover:underline">
//                     View Product Description
//                   </summary>
//                   <div className="mt-2 text-gray-300 text-sm">
//                     <ProductDescription html={product.descriptionHtml} />
//                   </div>
//                 </details>

//                 {/* Product Variants & Price */}
//                 {product.variants?.edges.length > 0 ? (
//                   <div className="mt-4">
//                     <h3 className="text-md font-semibold text-gray-100">
//                       Available Variants:
//                     </h3>
//                     <ul className="mt-2 text-sm text-gray-300">
//                       {product.variants.edges.map((variant: any) => (
//                         <li key={variant.node.id} className="mt-1">
//                           {variant.node.title} -{" "}
//                           <span className="font-bold text-indigo-400">
//                             {variant.node.price.amount}{" "}
//                             {variant.node.price.currencyCode}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ) : (
//                   <p className="font-bold text-lg text-indigo-400">
//                     {product.priceRange.minVariantPrice.amount}{" "}
//                     {product.priceRange.minVariantPrice.currencyCode}
//                   </p>
//                 )}

//                 {/* Buy Now Button */}
//                 <a
//                   href={productUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block mt-4 text-center text-indigo-400 underline hover:text-indigo-300 transition"
//                 >
//                   Buy Now
//                 </a>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* View More Button */}
//       {nextCursor && (
//         <div className="mt-12 text-center">
//           <a
//             href={`/Products?after=${encodeURIComponent(nextCursor)}`}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
//           >
//             View More
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

import ProductFetcher from "@/components/RecommendedProducts";
import React from "react";

function page() {
  return <ProductFetcher />;
}

export default page;
