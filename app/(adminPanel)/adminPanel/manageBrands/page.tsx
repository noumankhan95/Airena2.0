import React from "react";
import { Box, Typography } from "@mui/material";
import NavigateButton from "@/components/Buttons/functionButton";
import AllDealersTable from "@/components/AdminPanel/AllVendorsTable";
import AllVendorsTable from "@/components/AdminPanel/AllVendorsTable";

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
          Vendors
        </Typography>
      </Box>

      {/* Table Section */}
      <AllVendorsTable />
    </Box>
  );
}
