"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

// --- Define Types ---

export type AirenaProduct = {
  ProdID: string;
  Name: string;
  Description: string;
  Brand: string;
  Category: string;
  Tags: string;
  ImageURL: string;
  Handle: string;
};

export type ShopifyProduct = {
  cursor: string;
  node: {
    id: string;
    title: string;
    handle: string;
    descriptionHtml: string;
    images: { edges: { node: { url: string; altText?: string } }[] };
    variants?: {
      edges: {
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
        };
      }[];
    };
    priceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
  };
};

export type Product = AirenaProduct | ShopifyProduct;

export type ProductGridProps = {
  products: Product[];
};

// --- ProductGrid: Presentation Component ---

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products?.map((product) => {
        // If it's an Airena product (check for ProdID)
        if ("ProdID" in product) {
          const airena = product as AirenaProduct;
          // Build a URL for the product as needed.
          // (You may change the URL structure if needed.)
          const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${product.Handle}`;
          return (
            <div
              key={airena.ProdID}
              className="group border border-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {/* Product Image */}
              <a href={productUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={airena.ImageURL || "/placeholder.png"}
                  alt={airena.Name || "Product Image"}
                  className="w-full h-56 object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
              </a>

              {/* Product Details */}
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                  {airena.Name}
                </h2>
                <details className="mb-4">
                  <summary className="cursor-pointer text-indigo-400 font-medium hover:underline">
                    View Product Description
                  </summary>
                  <div className="mt-2 text-gray-300 text-sm">
                    {airena.Description}
                  </div>
                </details>
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-center text-indigo-400 underline hover:text-indigo-300 transition"
                >
                  Buy Now
                </a>
              </div>
            </div>
          );
        } else {
          // Otherwise it's a ShopifyProduct

          const shopify = product.node;
          const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${shopify.handle}`;
          return (
            <div
              key={shopify.id}
              className="group border border-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {/* Product Image */}
              <a href={productUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={
                    shopify.images?.edges[0]?.node?.url || "/placeholder.png"
                  }
                  alt={
                    shopify.images?.edges[0]?.node?.altText || "Product Image"
                  }
                  className="w-full h-56 object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
              </a>

              {/* Product Details */}
              <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                  {shopify.title}
                </h2>

                <details className="mb-4">
                  <summary className="cursor-pointer text-indigo-400 font-medium hover:underline">
                    View Product Description
                  </summary>
                  <div className="mt-2 text-gray-300 text-sm">
                    {/* You can reuse a component to display HTML safely, e.g. */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: shopify.descriptionHtml,
                      }}
                    />
                  </div>
                </details>

                {shopify.variants && shopify?.variants?.edges.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-100">
                      Available Variants:
                    </h3>
                    <ul className="mt-2 text-sm text-gray-300">
                      {shopify?.variants?.edges.map((variant: any) => (
                        <li key={variant?.node?.id} className="mt-1">
                          {variant?.node?.title} -{" "}
                          <span className="font-bold text-indigo-400">
                            {variant?.node?.price.amount}{" "}
                            {variant?.node?.price.currencyCode}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="font-bold text-lg text-indigo-400">
                    {shopify.priceRange?.minVariantPrice?.amount}{" "}
                    {shopify.priceRange?.minVariantPrice?.currencyCode}
                  </p>
                )}

                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 text-center text-indigo-400 underline hover:text-indigo-300 transition"
                >
                  Buy Now
                </a>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

// --- ProductFetcher: Container Component that Fetches Data ---

export default function ProductFetcher() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get uid from your Zustand store (or another auth source)
  const {
    info: { uid },
  } = useOwnersStore();

  useEffect(() => {
    // Subscribe to auth state; this returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // For example, check if user has any orders in Firestore
          const tokenResult = await user.getIdTokenResult();
          const isPrivilegedUser =
            tokenResult.claims.influencer ||
            tokenResult.claims.admin ||
            tokenResult.claims.vendor;
          const res = await getDoc(doc(db, "order", user.uid));
          let response;
          if (res.exists() && !isPrivilegedUser) {
            // If orders exist, fetch recommendations from the external API
            response = await fetch(
              `https://airena-recommendation-1019657848975.us-central1.run.app/recommendations?userId=${user.uid}&top_n=10`
            );
          } else {
            // Otherwise, fallback to fetch data from the internal API route
            response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchProductsForApp`
            );
          }

          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }

          const result = await response.json();
          console.log("LOgging result", result);
          // If uid exists, assume the external API returns a plain array. Otherwise use result.products.
          const fetchedProducts: Product[] =
            user.uid && res.exists() && !isPrivilegedUser
              ? result.recommendations
              : result.edges;
          setProducts(fetchedProducts);
        } else {
          let response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchProductsForApp`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }

          const result = await response.json();
          console.log("Result", result);
          // If uid exists, assume the external API returns a plain array. Otherwise use result.products.
          const fetchedProducts: Product[] = result.edges;
          setProducts(fetchedProducts);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching products"
        );
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [uid]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        Error: {error}
      </Typography>
    );
  }
  console.log("prodcts", products);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {uid ? "Recommended Products" : "Products"}
      </Typography>
      <ProductGrid products={products} />
    </Box>
  );
}
