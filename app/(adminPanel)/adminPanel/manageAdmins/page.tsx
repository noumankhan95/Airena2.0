import React from "react";
import { Box, Typography } from "@mui/material";
import NavigateButton from "@/components/Buttons/functionButton";
import AllInfluencersTable from "@/components/AdminPanel/AllinfluencersTable";
import AllAdminsTable from "@/components/AdminPanel/AllAdminsTable";

export default function ListDealers() {
  // Sample data for the table

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Influencers
        </Typography>
      </Box>

      {/* Table Section */}
      <AllAdminsTable />
    </Box>
  );
}
