import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ListingApprovedEmailProps = {
  propertyTitle: string;
  propertyUrl: string;
  isPaid?: boolean;
  invoiceNumber?: string;
};

export function ListingApprovedEmail({
  propertyTitle,
  propertyUrl,
  isPaid = false,
  invoiceNumber,
}: ListingApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Félicitations, votre bien est en ligne !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Dousell Immo</Heading>
          </Section>
          <Section style={content}>
            <Heading style={h2}>🎉 Félicitations !</Heading>
            <Text style={text}>
              Votre annonce <strong>{propertyTitle}</strong> a été approuvée et est maintenant en ligne.
            </Text>
            <Text style={text}>
              Elle est désormais visible par tous les visiteurs de Dousell Immo et peut générer des contacts.
            </Text>
            <Section style={buttonContainer}>
              <Link href={propertyUrl} style={button}>
                Voir mon annonce
              </Link>
            </Section>
            <Text style={text}>
              Partagez votre annonce avec vos proches pour maximiser sa visibilité !
            </Text>

            {/* Section Termes et Conditions pour les annonces payantes */}
            {isPaid && (
              <Section style={termsSection}>
                <Heading style={h3}>📋 Termes et Conditions</Heading>
                <Text style={termsText}>
                  <strong>Facture N° :</strong> {invoiceNumber || "N/A"}
                </Text>
                <Text style={termsText}>
                  <strong>Service :</strong> Boost Visibilité - Mise en avant de votre annonce
                </Text>
                <Text style={termsText}>
                  <strong>Montant payé :</strong> 5 000 FCFA
                </Text>
                <Text style={termsText}>
                  <strong>Conditions générales :</strong>
                </Text>
                <Text style={termsList}>
                  • Ce document tient lieu de preuve de paiement pour la mise en avant de votre annonce.
                </Text>
                <Text style={termsList}>
                  • Aucun remboursement ne sera effectué après la validation et la publication de l&apos;annonce.
                </Text>
                <Text style={termsList}>
                  • Pour toute réclamation concernant le service, veuillez contacter le support sous 48h après la publication.
                </Text>
                <Text style={termsList}>
                  • La mise en avant garantit une visibilité accrue de votre annonce sur la plateforme Dousell Immo.
                </Text>
                <Text style={termsText}>
                  <strong>Support :</strong> Pour toute question, contactez-nous à{" "}
                  <Link href="mailto:contact@doussel-immo.com" style={linkStyle}>
                    contact@doussel-immo.com
                  </Link>{" "}
                  ou au +221 77 123 45 67
                </Text>
                <Text style={termsNote}>
                  📎 Votre facture détaillée est jointe à cet email en pièce jointe PDF.
                </Text>
              </Section>
            )}
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              Dousell Immo - L&apos;immobilier de confiance à Dakar
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#05080c",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  backgroundColor: "#05080c",
  borderRadius: "8px 8px 0 0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "32px 24px",
};

const h2 = {
  color: "#05080c",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const text = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#25D366",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#999999",
  fontSize: "12px",
  margin: "0",
};

const termsSection = {
  marginTop: "32px",
  padding: "24px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
};

const h3 = {
  color: "#05080c",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const termsText = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const termsList = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "4px 0 4px 16px",
  paddingLeft: "8px",
};

const termsNote = {
  color: "#25D366",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0 0",
  fontWeight: "bold",
};

const linkStyle = {
  color: "#25D366",
  textDecoration: "underline",
};

