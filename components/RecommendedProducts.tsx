"use client";

import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Fade, Typography } from "@mui/material";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Card,
  CardMedia,
  CardContent,
  Collapse,
  Button,
  CardActions,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products?.map((product) => {
        // If it's an Airena product (check for ProdID)
        if ("ProdID" in product) {
          const airena = product as AirenaProduct;
          // Build a URL for the product as needed.
          // (You may change the URL structure if needed.)
          const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${product.Handle}`;
          return <ProductCard airena={airena} />;
        } else {
          // Otherwise it's a ShopifyProduct

          const shopify = product.node;
          const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${shopify.handle}`;
          return <ShopifyProductCard shopify={shopify} />;
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          minHeight: "100vh",
        }}
      >
        <Typography variant="body1" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }
  console.log("prodcts", products);
  return (
    <Box sx={{ p: 5, minHeight: "100vh" }}>
      <Typography variant="h6" gutterBottom>
        {uid ? "Recommended Products" : "Products"}
      </Typography>
      <ProductGrid products={products} />
    </Box>
  );
}

function ProductCard({ airena }: { airena: any }) {
  const [hovered, setHovered] = useState(false);
  const productUrl = `/product/${airena?.ProdID}`;

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        overflow: "hidden",
        color: "#f8fafc",
        boxShadow: hovered
          ? "0 12px 30px rgba(70, 193, 144, 0.3)"
          : "0 6px 18px rgba(0, 0, 0, 0.4)",
        transition: "all 0.4s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 320,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 200,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e293b",
        }}
      >
        <CardMedia
          component="img"
          image={airena.ImageURL || "/placeholder.png"}
          alt={airena.Name || "Product Image"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.3s ease",
            filter: hovered ? "brightness(85%)" : "brightness(100%)",
          }}
        />
      </Box>

      <CardContent sx={{ py: 2, flexGrow: 1 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "#e2e8f0", mb: 1 }}
        >
          {airena.Name}
        </Typography>
      </CardContent>

      <Box px={3} pb={3}>
        <Button
          fullWidth
          variant="outlined"
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
          sx={{
            borderColor: "#22c55e",
            color: "#bbf7d0",
            fontWeight: 600,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(34,197,94,0.1)",
              borderColor: "#4ade80",
              color: "#86efac",
            },
          }}
        >
          View Product
        </Button>
      </Box>
    </Card>
  );
}

function ShopifyProductCard({ shopify }: { shopify: any }) {
  const [hovered, setHovered] = useState(false);
  const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${shopify.handle}`;
  const image = shopify?.images?.edges[0]?.node;
  const price =
    shopify?.variants?.edges?.[0]?.node?.price?.amount ||
    shopify?.priceRange?.minVariantPrice?.amount;

  const currency =
    shopify?.variants?.edges?.[0]?.node?.price?.currencyCode ||
    shopify?.priceRange?.minVariantPrice?.currencyCode;
  console.log(price);
  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        overflow: "hidden",
        color: "#f8fafc",
        boxShadow: hovered
          ? "0 12px 30px rgba(70, 193, 144, 0.3)"
          : "0 6px 18px rgba(0, 0, 0, 0.4)",
        transition: "all 0.4s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 320,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 200,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e293b",
        }}
      >
        <CardMedia
          component="img"
          image={image?.url || "/placeholder.png"}
          alt={image?.altText || "Product Image"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.3s ease",
            filter: hovered ? "brightness(85%)" : "brightness(100%)",
          }}
        />
      </Box>

      <CardContent sx={{ py: 2, flexGrow: 1 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "#e2e8f0", mb: 1 }}
        >
          {shopify.title}
        </Typography>

        {shopify.variants?.edges?.length > 1 ? (
          <>
            <Divider sx={{ my: 1.5, borderColor: "#334155" }} />
            <Box display="flex" flexDirection="column" gap={0.5}>
              {shopify?.variants?.edges?.map((variant: any) => (
                <Typography
                  key={variant.node.id}
                  variant="body2"
                  sx={{ color: "#94a3b8" }}
                >
                  {variant.node.title} –{" "}
                  <strong style={{ color: "#4ade80" }}>
                    {variant.node.price} INR
                  </strong>
                </Typography>
              ))}
            </Box>
          </>
        ) : (
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mt: 2, color: "#4ade80" }}
          >
            {shopify.variants?.edges?.[0]?.node.price} INR
          </Typography>
        )}
      </CardContent>

      <Box px={3} pb={3}>
        <Button
          fullWidth
          variant="outlined"
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
          sx={{
            borderColor: "#22c55e",
            color: "#bbf7d0",
            fontWeight: 600,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(34,197,94,0.1)",
              borderColor: "#4ade80",
              color: "#86efac",
            },
          }}
        >
          View Product
        </Button>
      </Box>
    </Card>
  );
}
