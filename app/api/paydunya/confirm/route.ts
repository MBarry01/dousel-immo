import { checkPayDunyaInvoiceStatus } from "@/lib/paydunya";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return Response.json({ error: "Token requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    const invoice = await checkPayDunyaInvoiceStatus(token);
    const status =
      (invoice as any)?.status ||
      (invoice as any)?.invoice_status ||
      (invoice as any)?.invoice?.status ||
      (invoice as any)?.state ||
      null;

    return Response.json({
      success: true,
      status,
      response: invoice,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification PayDunya:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la vérification du paiement",
      },
      { status: 500 }
    );
  }
}

