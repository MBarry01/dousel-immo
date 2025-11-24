"use server";

import { createClient } from "@/utils/supabase/server";

type TrackActionParams = {
  propertyId: string;
  actionType: "view" | "whatsapp_click" | "phone_click";
  userId?: string | null;
};

/**
 * Enregistre une action (vue, clic WhatsApp, clic téléphone) pour une propriété
 */
export async function trackPropertyAction({
  propertyId,
  actionType,
  userId,
}: TrackActionParams) {
  try {
    const supabase = await createClient();

    // Vérifier que la propriété existe
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      console.error("❌ Propriété non trouvée:", propertyError);
      return { error: "Propriété non trouvée" };
    }

    // Récupérer l'utilisateur actuel si non fourni
    let currentUserId = userId;
    if (currentUserId === undefined) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUserId = user?.id || null;
    }

    // Insérer l'action dans property_stats
    const { error: insertError } = await supabase
      .from("property_stats")
      .insert({
        property_id: propertyId,
        action_type: actionType,
        user_id: currentUserId,
      });

    if (insertError) {
      console.error("❌ Erreur lors de l'insertion de la stat:", insertError);
      return { error: "Erreur lors de l'enregistrement de la statistique" };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur inattendue dans trackPropertyAction:", error);
    return {
      error: error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}
