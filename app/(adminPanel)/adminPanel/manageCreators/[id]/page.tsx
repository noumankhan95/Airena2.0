"use client";

import { useParams, useRouter } from "next/navigation";
import useInfluencerStore from "@/store/adminPanel/influencersStore";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
import { Timestamp } from "firebase/firestore";

const InfluencerDetail = () => {
  const { id } = useParams();
  //@ts-ignore
  const Influencer = useInfluencerStore((state) =>
    state.getInfluencerById(id as string)
  );
  const router = useRouter();

  if (!Influencer) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Influencer not found.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/adminPanel")}
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
        {Influencer.name}
      </Typography>

      <Typography variant="subtitle1" textAlign="center" gutterBottom>
        {Influencer.email}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Contact Details:
        </Typography>
        <Typography variant="body1">{Influencer.contactDetails}</Typography>

        <Typography variant="h6" fontWeight="bold">
          Account Created:
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          {
            //@ts-ignore
            new Date(Influencer.createdAt * 1000).toLocaleString()
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

export default InfluencerDetail;
