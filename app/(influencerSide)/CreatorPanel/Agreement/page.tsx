import { Typography, Paper, Container, Card, CardContent } from "@mui/material";

export default function AgreementPage() {
  return (
    <Container
      maxWidth="md"
      className="flex flex-col justify-start items-center min-h-screen"
    >
      <Typography variant="h5" className="text-indigo-700 font-bold !my-4">
        Agreement Reminder
      </Typography>

      <Paper elevation={3} className="p-4">
        <Typography variant="body1">
          By using our services, you acknowledge and agree to our Terms and
          Conditions. This includes:
        </Typography>
        <ul className="list-disc pl-6 mt-3">
          <li>Providing accurate and up-to-date information.</li>
          <li>Using the platform responsibly and ethically.</li>
          <li>Respecting intellectual property rights.</li>
          <li>Not engaging in fraudulent or illegal activities.</li>
          <li>
            Understanding that your account may be suspended for policy
            violations.
          </li>
        </ul>
        <Typography variant="body2" className="mt-4">
          Please review our{" "}
          <a href="#" className=" underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className=" underline">
            Privacy Policy
          </a>{" "}
          for more details.
        </Typography>
      </Paper>
    </Container>
  );
}
