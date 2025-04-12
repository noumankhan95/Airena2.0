import React, { useState } from "react";
import { Card, CardMedia, Typography, Fade } from "@mui/material";

export default function UserProductOverlay({ products, influencerId }: any) {
  if (!products || products.length === 0) return null;

  return (
    <>
      <Fade in={true}>
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-10 max-w-[180px]">
          <Typography
            variant="caption"
            component="div"
            sx={{
              color: "#4CAF50",
              fontWeight: "bold",
              fontSize: "0.65rem",
              textAlign: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "2px 8px",
              borderRadius: "4px",
              marginBottom: "2px",
              backdropFilter: "blur(8px)",
            }}
          >
            Featured Products
          </Typography>
          {products?.map((product: any) => (
            <Card
              key={product.node.id}
              className="cursor-pointer transition-all"
              sx={{
                width: { xs: 120, md: 160 }, // <-- smaller on mobile
                backgroundColor: "black",
                padding: { xs: 0.2, md: 0 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 0,
              }}
            >
              <CardMedia
                component="img"
                image={product.node.images.edges[0]?.node.url}
                alt={product.variant.title}
                sx={{
                  width: "100%",
                  height: { xs: 50, md: 80 },
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: { xs: 0, md: 1 },
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: { xs: "0.3rem", md: "0.8rem" },
                  textAlign: "center",
                }}
              >
                {product.variant.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#4CAF50",
                  fontWeight: "bold",
                  fontSize: { xs: "0.3rem", md: "0.7rem" },
                  textAlign: "center",
                  my: 0.5,
                }}
              >
                ${product.variant.price}
              </Typography>
            </Card>
          ))}
        </div>
      </Fade>
    </>
  );
}
