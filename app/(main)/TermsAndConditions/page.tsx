import { Container, Typography, Box, Paper } from "@mui/material";

export default function TermsAndConditionsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6, backgroundColor: "transparent" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Terms and Conditions
        </Typography>

        <Typography variant="body1" paragraph>
          At <strong>Airena</strong>, we believe in building a respectful,
          creative, and safe environment for content creators, livestreamers,
          learners, and viewers alike. Our Community Guidelines are designed to
          ensure that all users feel welcome and protected while engaging with
          content and each other.
        </Typography>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Content Guidelines
          </Typography>
          <Typography variant="body1" paragraph>
            Users must refrain from posting or streaming content that includes
            hate speech, harassment, sexual or violent material, misinformation,
            or anything that promotes illegal or harmful activity. We do not
            allow impersonation, threats, or the exploitation of minors in any
            form.
          </Typography>
          <Typography variant="body1" paragraph>
            Content must align with applicable local and international laws.
            Respectful dialogue, educational integrity, and inclusiveness are
            core to Airena’s mission, and violations may result in content
            removal, suspension, or termination of accounts.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Monetization Clause
          </Typography>
          <Typography variant="body1" paragraph>
            In addition, if you stream, upload, or monetize content on the
            platform, you are subject to our{" "}
            <strong>Content Creator Agreement</strong>, which outlines your
            responsibilities as a contributor to the ecosystem.
          </Typography>
          <Typography variant="body1" paragraph>
            By uploading content, you confirm that you own or have the necessary
            rights to share and distribute it, and you grant Airena a worldwide,
            non-exclusive license to use, host, display, and promote your
            content on the platform.
          </Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Copyright Clause
          </Typography>
          <Typography variant="body1" paragraph>
            You are also responsible for ensuring your content complies with
            copyright laws and does not infringe on the intellectual property of
            others. Airena reserves the right to review, demonetize, or remove
            content that violates these terms.
          </Typography>
          <Typography variant="body1" paragraph>
            We encourage all creators to uphold high standards of authenticity,
            transparency, and community respect.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
