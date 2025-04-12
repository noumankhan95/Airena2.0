import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  Link,
  Divider,
} from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ background: "transparent" }}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #000, #1a1a1a)",
          color: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        {/* Title */}
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          About Airena
        </Typography>

        {/* Intro */}
        <Typography variant="body1" paragraph>
          United by one vision, powered by one mission,{" "}
          <Typography component="span" color="primary" fontWeight="bold">
            Airena
          </Typography>{" "}
          is a revolution in the sports and gaming ecosystem.
        </Typography>

        {/* Vision & Mission */}
        <Divider sx={{ my: 3, bgcolor: "gray" }} />
        <Typography variant="h6" color="primary">
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          To see our tricolour flag hoisted at a global pedestal as the true
          potential of India shines in the world of sports and gaming.
        </Typography>

        <Typography variant="h6" color="primary">
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          To deliver a platform that hosts communities valuing the spirit of
          sports and gaming culture, giving an equitable opportunity for
          everyone to showcase their skills.
        </Typography>

        {/* Key Features */}
        <Divider sx={{ my: 3, bgcolor: "gray" }} />
        <Typography variant="h6" color="primary">
          Why Airena?
        </Typography>
        <List sx={{ textAlign: "left", mx: "auto", display: "inline-block" }}>
          {[
            "📡 High-quality live streaming",
            "🤝 Interactive collaboration tools",
            "📢 Personalized content recommendations",
            "💰 Built-in e-commerce marketplace",
          ].map((feature, index) => (
            <ListItem key={index} sx={{ color: "white" }}>
              {feature}
            </ListItem>
          ))}
        </List>

        {/* Community Engagement */}
        <Divider sx={{ my: 3, bgcolor: "gray" }} />
        <Typography variant="h6" color="primary">
          Join the Community
        </Typography>
        <Typography variant="body1">
          Whether you're an athlete, gamer, or sports enthusiast, Airena
          provides the resources and support to achieve your goals.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Stay updated and connect with us on{" "}
          <Link href="#" color="primary" underline="hover">
            Twitter
          </Link>
          ,{" "}
          <Link href="#" color="primary" underline="hover">
            Instagram
          </Link>
          , and{" "}
          <Link href="#" color="primary" underline="hover">
            Facebook
          </Link>
          .
        </Typography>

        {/* Footer */}
        <Typography
          variant="caption"
          color="gray"
          display="block"
          sx={{ mt: 4 }}
        >
          &copy; 2025 Airena. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}
