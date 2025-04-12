"use client";

import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
import useVendorstore from "@/store/adminPanel/vendorStore";

const VendorDetails = () => {
  const { id } = useParams();
  //@ts-ignore
  const Vendor = useVendorstore((state) => state.getVendorId(id as string));
  const router = useRouter();

  if (!Vendor) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Vendor not found.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        {Vendor.name}
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        gutterBottom
      >
        {Vendor.email}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Contact Details:
        </Typography>
        <Typography variant="body1" sx={{ color: "gray" }}>
          {Vendor.contactDetails}
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          Account Created:
        </Typography>
        <Typography variant="body1" sx={{ color: "gray", fontStyle: "italic" }}>
          {
            //@ts-ignore
            new Date(Vendor.createdAt * 1000).toLocaleString()
          }
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("/")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default VendorDetails;
