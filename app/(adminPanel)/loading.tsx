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
      <CircularProgress size={80} style={{ color: "#46c190" }} />
    </Container>
  );
};

export default Loading;
