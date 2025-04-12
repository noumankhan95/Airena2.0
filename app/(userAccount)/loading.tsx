// components/Loading.tsx

import React from "react";
import { CircularProgress, Container, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <CircularProgress size={80} color="primary" />
      <Typography variant="h5" color="textSecondary" marginTop={2}>
        Loading, please wait...
      </Typography>
    </Container>
  );
};

export default Loading;
