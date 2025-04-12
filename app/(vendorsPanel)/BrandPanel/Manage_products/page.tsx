import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Link from "next/link";
import { cookies } from "next/headers";

export const revalidate = 10;

export default async function VendorProductsPage() {
  const cookieStore = await cookies();
  const vendorName = cookieStore.get("vendorName")?.value || "DefaultVendor";
  // const vendorName = "Thy Bazaar";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/fetch_products?vendor=${vendorName}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const products = data?.edges || [];

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 4 }}>
      <Typography variant="h3" align="center" gutterBottom>
        My Uploaded Products
      </Typography>

      {products.length === 0 && (
        <Typography variant="body1" align="center">
          No products found for Brand: {vendorName}
        </Typography>
      )}

      <Grid container spacing={4}>
        {products.map(({ node: product }: any) => {
          const productUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${product.handle}`;
          return (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Link href={productUrl} passHref legacyBehavior>
                <Card
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "block",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                    textDecoration: "none",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      product.images?.edges[0]?.node?.url || "/placeholder.png"
                    }
                    alt={
                      product.images?.edges[0]?.node?.altText || "Product Image"
                    }
                    sx={{
                      height: 200,
                      objectFit: "cover",
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {product.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {product.priceRange?.minVariantPrice?.amount}{" "}
                      {product.priceRange?.minVariantPrice?.currencyCode}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
