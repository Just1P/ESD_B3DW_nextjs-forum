import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export const ResetPasswordEmail = ({
  username = "Utilisateur",
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe - Forum</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🔐 Réinitialisation de mot de passe</Heading>
          <Text style={text}>Bonjour {username},</Text>
          <Text style={text}>
            Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le
            bouton ci-dessous pour créer un nouveau mot de passe.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>
          <Text style={text}>
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre
            navigateur :
          </Text>
          <Text style={link}>{resetLink}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Ce lien est valable pendant 1 heure. Si vous n&apos;avez pas demandé
            cette réinitialisation, vous pouvez ignorer cet email en toute
            sécurité.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "560px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 40px",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "0 40px",
  maxWidth: "480px",
};

const link = {
  color: "#2563eb",
  fontSize: "14px",
  padding: "0 40px",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 40px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 40px",
};
