import React from "react";
import { Box, Typography } from "@mui/material";
import NavigateButton from "@/components/Buttons/functionButton";
import AllDealersTable from "@/components/AdminPanel/AllVendorsTable";
import AllBlogsTable from "@/components/AdminPanel/AllBlogsTable";

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
          Blogs
        </Typography>
      </Box>
      <AllBlogsTable />
    </Box>
  );
}
