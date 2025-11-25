import { sendEmail as sendEmailGmail, sendInvoiceEmail as sendInvoiceEmailGmail, getAdminEmail as getAdminEmailGmail } from "./mail-gmail";
import { render } from "@react-email/render";
import React from "react";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "barrymohamadou98@gmail.com";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  from?: string; // Conservé pour compatibilité
  fromName?: string;
  user_id?: string | null;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
};

/**
 * Fonction générique pour envoyer des emails via Gmail (Nodemailer)
 * Utilise GMAIL_USER et GMAIL_APP_PASSWORD depuis les variables d'environnement
 */
export async function sendEmail({
  to,
  subject,
  react,
  html,
  fromName = "Dousell Immo",
  user_id = null,
  attachments,
}: SendEmailOptions) {
  // Si react est fourni, le convertir en HTML
  let emailHtml = html;
  if (react && !html) {
    emailHtml = await render(react);
  }

  return sendEmailGmail({
    to,
    subject,
    html: emailHtml,
    attachments,
  });
}

/**
 * Fonction pour envoyer une facture par email
 * @param to - Adresse email du destinataire
 * @param clientName - Nom du client
 * @param pdfBuffer - Buffer du PDF de la facture
 * @param invoiceNumber - Numéro de facture (optionnel)
 * @param amount - Montant de la facture (optionnel)
 */
export async function sendInvoiceEmail({
  to,
  clientName,
  pdfBuffer,
  invoiceNumber,
  amount,
}: {
  to: string;
  clientName: string;
  pdfBuffer: Buffer;
  invoiceNumber?: string;
  amount?: number;
}) {
  return sendInvoiceEmailGmail({
    to,
    clientName,
    pdfBuffer,
    invoiceNumber,
    amount,
  });
}

/**
 * Email de l'admin (pour les notifications)
 */
export function getAdminEmail() {
  return getAdminEmailGmail() || ADMIN_EMAIL;
}

