import { Box, Typography, Container, Divider, Link } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container
      maxWidth="md"
      sx={{
        background: "transparent",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(to bottom, #000, #1a1a1a)",
          color: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          gutterBottom
        >
          Privacy Policy
        </Typography>

        {/* Effective Date */}
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="gray"
          gutterBottom
        >
          Effective Date: April 4, 2025
        </Typography>

        {/* Introduction */}
        <Typography variant="body1" paragraph>
          Airena is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and safeguard your information when you
          use our services. By using Airena, you agree to the collection and use
          of information in accordance with this policy.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 1: Information We Collect */}
        <Typography variant="h6" color="primary">
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information to provide and improve our services:
        </Typography>
        <Typography variant="body2">
          <strong>Information You Provide:</strong> When you create an Airena
          account, you provide personal information such as your name, email
          address, and profile picture. You may also provide content, such as
          videos, comments, and messages.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Automatically Collected Information:</strong> We collect
          information about your use of our services, including your
          interactions with content, device information, IP address, and
          location data.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 2: How We Use Your Information */}
        <Typography variant="h6" color="primary">
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use the information we collect to:
        </Typography>
        <Typography variant="body2">
          • Provide, maintain, and improve our services.
        </Typography>
        <Typography variant="body2">
          • Personalize your experience and recommend content.
        </Typography>
        <Typography variant="body2">
          • Communicate with you about updates and support.
        </Typography>
        <Typography variant="body2">
          • Ensure the security of our services and prevent abuse.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 3: Sharing Your Information */}
        <Typography variant="h6" color="primary">
          3. Sharing Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We do not sell your personal information. We may share your
          information:
        </Typography>
        <Typography variant="body2">• With your consent.</Typography>
        <Typography variant="body2">
          • With service providers who assist us in operating our services.
        </Typography>
        <Typography variant="body2">
          • For legal reasons, such as complying with legal obligations or
          protecting against harm.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 4: Your Privacy Controls */}
        <Typography variant="h6" color="primary">
          4. Your Privacy Controls
        </Typography>
        <Typography variant="body1" paragraph>
          You have control over your personal information:
        </Typography>
        <Typography variant="body2">
          • <strong>Account Settings:</strong> You can update your account
          information and preferences.
        </Typography>
        <Typography variant="body2">
          • <strong>Content Management:</strong> You can manage or delete the
          content you have uploaded.
        </Typography>
        <Typography variant="body2">
          • <strong>Privacy Settings:</strong> You can adjust your privacy
          settings to control the visibility of your information.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 5: Data Security */}
        <Typography variant="h6" color="primary">
          5. Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement security measures to protect your information from
          unauthorized access, alteration, disclosure, or destruction.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 6: Children's Privacy */}
        <Typography variant="h6" color="primary">
          6. Children's Privacy
        </Typography>
        <Typography variant="body1" paragraph>
          Airena is not intended for children under the age of 13. We do not
          knowingly collect personal information from children under 13.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 7: Changes to This Privacy Policy */}
        <Typography variant="h6" color="primary">
          7. Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. We will notify
          you of any significant changes by posting the new policy on our
          website.
        </Typography>

        <Divider sx={{ my: 3, bgcolor: "gray" }} />

        {/* Section 8: Contact Us */}
        <Typography variant="h6" color="primary">
          8. Contact Us
        </Typography>
        <Typography variant="body1">
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <Link
            href="mailto:contact@airena.com"
            color="primary"
            underline="hover"
          >
            contact@airena.com
          </Link>
          .
        </Typography>

        {/* Footer */}
        <Typography
          variant="caption"
          color="gray"
          display="block"
          textAlign="center"
          sx={{ mt: 4 }}
        >
          &copy; {new Date().getFullYear()} Airena. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}
