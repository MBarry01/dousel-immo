import PDFDocument from "pdfkit";

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  clientName: string;
  clientEmail: string;
  items: {
    description: string;
    amount: number;
  }[];
  total: number;
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const buffers: Buffer[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("DOUSSEL IMMO", { align: "left" })
      .fontSize(10)
      .font("Helvetica")
      .text("Votre partenaire immobilier de confiance", { align: "left" })
      .moveDown();

    // Ligne de séparation
    doc
      .moveTo(50, 100)
      .lineTo(550, 100)
      .strokeColor("#cccccc")
      .lineWidth(1)
      .stroke()
      .moveDown(2);

    // Invoice Details (Right aligned)
    const invoiceInfoTop = 120;
    doc
      .fontSize(10)
      .text("FACTURE N°", 400, invoiceInfoTop, { align: "right" })
      .font("Helvetica-Bold")
      .text(data.invoiceNumber, 400, invoiceInfoTop + 15, { align: "right" })
      .font("Helvetica")
      .text("Date d'émission", 400, invoiceInfoTop + 35, { align: "right" })
      .text(data.date.toLocaleDateString("fr-FR"), 400, invoiceInfoTop + 50, { align: "right" });

    // Client Details (Left aligned)
    doc
      .text("FACTURÉ À", 50, invoiceInfoTop)
      .font("Helvetica-Bold")
      .text(data.clientName, 50, invoiceInfoTop + 15)
      .font("Helvetica")
      .text(data.clientEmail, 50, invoiceInfoTop + 30)
      .moveDown(4);

    // Items Table
    const tableTop = 250;
    
    // Headers
    doc
      .rect(50, tableTop, 500, 30)
      .fill("#f5f5f5")
      .stroke();
      
    doc
      .fillColor("#000000")
      .font("Helvetica-Bold")
      .text("DESCRIPTION", 60, tableTop + 10)
      .text("MONTANT", 450, tableTop + 10, { align: "right" });

    // Items
    let y = tableTop + 40;
    data.items.forEach((item) => {
      doc
        .font("Helvetica")
        .text(item.description, 60, y)
        .text(`${item.amount.toLocaleString("fr-SN")} FCFA`, 450, y, { align: "right" });
      y += 30;
    });

    // Ligne total
    doc
      .moveTo(50, y)
      .lineTo(550, y)
      .strokeColor("#000000")
      .lineWidth(1)
      .stroke();

    // Total
    y += 20;
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("TOTAL NET À PAYER", 300, y)
      .text(`${data.total.toLocaleString("fr-SN")} FCFA`, 450, y, { align: "right" });

    // Termes et conditions (Footer)
    const footerTop = 700;
    doc
      .fontSize(8)
      .font("Helvetica-Oblique")
      .text("Termes et conditions :", 50, footerTop)
      .font("Helvetica")
      .text(
        "Ce document tient lieu de preuve de paiement. Aucun remboursement ne sera effectué après la validation de l'annonce. Pour toute réclamation, veuillez contacter le support sous 48h.",
        50,
        footerTop + 15,
        { width: 500 }
      );

    doc
      .fontSize(8)
      .text(
        "Doussel Immo - Dakar, Sénégal - Support: +221 77 123 45 67 - Email: contact@doussel-immo.com",
        50,
        750,
        { align: "center", width: 500 }
      );

    doc.end();
  });
}

