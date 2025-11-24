import { supabase } from "@/lib/supabase";
import type { Property } from "@/types/property";

export type PropertyFilters = {
  q?: string; // Recherche textuelle
  category?: Property["transaction"];
  city?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: Property["status"];
  rooms?: number;
  bedrooms?: number;
  hasBackupGenerator?: boolean;
  hasWaterTank?: boolean;
  type?: Property["details"]["type"];
  types?: Property["details"]["type"][]; // Support pour sélection multiple
  limit?: number;
};

type SupabasePropertyRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Property["transaction"];
  transaction?: Property["transaction"];
  status?: Property["status"];
  location?: {
    city?: string;
    address?: string;
    landmark?: string;
    coords?: { lat: number; lng: number };
  };
  specs?: {
    surface?: number;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    dpe?: Property["specs"]["dpe"];
  };
  features?: {
    hasGenerator?: boolean;
    hasWaterTank?: boolean;
    security?: boolean;
    [key: string]: unknown;
  };
  details?: {
    type?: Property["details"]["type"];
    year?: number;
    heating?: string;
    charges?: number;
    taxeFonciere?: number;
    parking?: string;
  };
  images?: string[];
  agent?: {
    name?: string;
    photo?: string;
    phone?: string;
    whatsapp?: string;
  };
  owner?: {
    id?: string;
    full_name?: string;
    avatar_url?: string;
    role?: "particulier" | "agent" | "admin";
    phone?: string;
    is_verified?: boolean;
    created_at?: string;
  } | Array<{
    id?: string;
    full_name?: string;
    avatar_url?: string;
    role?: "particulier" | "agent" | "admin";
    phone?: string;
    is_verified?: boolean;
    created_at?: string;
  }>;
  proximites?: {
    transports?: string[];
    ecoles?: string[];
    commerces?: string[];
  };
  disponibilite?: string;
  created_at?: string;
  service_type?: "mandat_confort" | "boost_visibilite";
};

const mapProperty = (row: SupabasePropertyRow): Property => {
  const location = row.location ?? {};
  const specs = row.specs ?? {};
  const features = row.features ?? {};
  const agent = row.agent ?? {};
    // Gérer la jointure Supabase : owner peut être un objet ou un tableau
    // Supabase retourne les jointures sous le nom de l'alias (owner) ou de la table (profiles)
    const ownerData = Array.isArray(row.owner) 
      ? row.owner[0] 
      : (row.owner || (row as any).profiles);
    const owner = ownerData ?? {};
  const detail = row.details ?? {};
  const proximites = row.proximites;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    transaction: row.category ?? row.transaction ?? "vente",
    status: row.status ?? "disponible",
    location: {
      city: location.city ?? "",
      address: location.address ?? "",
      landmark: location.landmark ?? "",
      coords: location.coords ?? { lat: 0, lng: 0 },
    },
    specs: {
      surface: specs.surface ?? 0,
      rooms: specs.rooms ?? 0,
      bedrooms: specs.bedrooms ?? 0,
      bathrooms: specs.bathrooms ?? 0,
      dpe: specs.dpe ?? "B",
    },
    details: {
      type: detail.type ?? "Appartement",
      year: detail.year ?? 0,
      heating: detail.heating ?? "",
      charges: detail.charges,
      taxeFonciere: detail.taxeFonciere,
      parking: detail.parking,
      hasBackupGenerator: features.hasGenerator ?? false,
      hasWaterTank: features.hasWaterTank ?? false,
      security: features.security ?? false,
    },
    images: row.images ?? [],
    agent: {
      name: agent.name ?? "",
      photo: agent.photo ?? "",
      phone: agent.phone ?? "",
      whatsapp: agent.whatsapp,
    },
    owner: owner && (owner.phone || owner.full_name || owner.id)
      ? {
          id: owner.id,
          full_name: owner.full_name,
          avatar_url: owner.avatar_url,
          role: owner.role || "particulier",
          phone: owner.phone,
          is_verified: owner.is_verified || false,
          created_at: owner.created_at,
        }
      : undefined,
    disponibilite: row.disponibilite ?? "Immédiate",
    proximites: proximites && (
      proximites.transports?.length ||
      proximites.ecoles?.length ||
      proximites.commerces?.length
    ) ? proximites as Property["proximites"] : undefined,
    service_type: row.service_type,
  };
};

export const getProperties = async (filters: PropertyFilters = {}) => {
  try {
    // Optimisation : ne sélectionner que les colonnes nécessaires pour la liste
    // Cela réduit significativement le transfert de données
    let query = supabase
      .from("properties")
      .select(
        "id, title, description, price, category, status, location, specs, details, features, images, agent, created_at, validation_status"
      );

    // Filtrer uniquement les propriétés approuvées et disponibles
    // Ces filtres garantissent que seules les annonces valides sont affichées
    query = query.eq("validation_status", "approved");
    query = query.eq("status", "disponible");

    // Recherche textuelle (q) : recherche dans le titre, la description et la ville
    if (filters.q) {
      query = query.or(
        `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%,location->>city.ilike.%${filters.q}%`
      );
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.city) {
      query = query.eq("location->>city", filters.city);
    }
    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.location) {
      query = query.ilike("location->>city", `%${filters.location}%`);
    } else if (filters.city) {
      query = query.eq("location->>city", filters.city);
    }
    if (filters.rooms) {
      query = query.gte("specs->>rooms", String(filters.rooms));
    }
    if (filters.bedrooms) {
      query = query.gte("specs->>bedrooms", String(filters.bedrooms));
    }
    if (filters.hasBackupGenerator) {
      query = query.eq("features->>hasGenerator", "true");
    }
    if (filters.hasWaterTank) {
      query = query.eq("features->>hasWaterTank", "true");
    }
    // Support pour un seul type ou plusieurs types (OR)
    if (filters.types && filters.types.length > 0) {
      // Si plusieurs types sont sélectionnés, utiliser OR
      // Syntaxe Supabase: "field.eq.value1,field.eq.value2"
      const orConditions = filters.types
        .map((type) => `details->>type.eq.${type}`)
        .join(",");
      query = query.or(orConditions);
    } else if (filters.type) {
      // Support rétrocompatibilité pour un seul type
      query = query.eq("details->>type", filters.type);
    }

    query = query.order("created_at", {
      ascending: false,
    });

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error("getProperties Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    return (data ?? []).map(mapProperty);
  } catch (error) {
    console.error("getProperties error:", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
};

export const getPropertyById = async (id: string) => {
  try {
    // Pour l'instant, utiliser directement le fallback (requête séparée)
    // car la jointure peut ne pas fonctionner si la table profiles n'existe pas encore
    // ou si la relation n'est pas configurée dans Supabase
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      // Si c'est une erreur 404 (not found), c'est normal
      if (error.code === "PGRST116") {
        console.warn("getPropertyById: Property not found for id:", id);
        return null;
      }
      throw error;
    }
    
    if (!data) {
      console.warn("getPropertyById: No data returned for id:", id);
      return null;
    }
    
    // Si on a des données et un owner_id, récupérer le profil séparément
    if (data.owner_id) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, role, phone, is_verified, created_at")
          .eq("id", data.owner_id)
          .single();
        
        if (!profileError && profileData) {
          data.owner = profileData;
        } else if (profileError) {
          // Si la table profiles n'existe pas encore, c'est normal
          if (profileError.code === "PGRST116" || profileError.message?.includes("does not exist")) {
            console.warn("getPropertyById: Table profiles n'existe pas encore ou profil non trouvé", {
              owner_id: data.owner_id,
              code: profileError.code,
              message: profileError.message,
            });
          } else {
            console.warn("getPropertyById: Erreur lors de la récupération du profil", {
              code: profileError.code,
              message: profileError.message,
              owner_id: data.owner_id,
            });
          }
        } else {
          console.warn("getPropertyById: Aucun profil trouvé pour owner_id", {
            owner_id: data.owner_id,
          });
        }
      } catch (profileError) {
        console.warn("getPropertyById: Exception lors de la récupération du profil", profileError);
      }
    }
    
    try {
      const mappedProperty = mapProperty(data as SupabasePropertyRow);
      return mappedProperty;
    } catch (mappingError) {
      console.error("getPropertyById mapping error:", {
        error: mappingError,
        data,
        id,
        errorMessage: mappingError instanceof Error ? mappingError.message : String(mappingError),
        errorStack: mappingError instanceof Error ? mappingError.stack : undefined,
      });
      return null;
    }
  } catch (error) {
    console.error("getPropertyById error:", {
      error,
      errorType: typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      id,
    });
    return null;
  }
};

export const getLatestProperties = async (limit = 6) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, description, price, category, status, location, specs, details, features, images, agent, created_at, validation_status")
      .eq("validation_status", "approved")
      .eq("status", "disponible")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapProperty);
  } catch (error) {
    console.error("getLatestProperties error", error);
    return [];
  }
};

/**
 * Récupère les IDs des biens approuvés pour la génération statique
 * Utilisé dans generateStaticParams pour pré-générer les pages
 */
export const getApprovedPropertyIds = async (limit = 20) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id")
      .eq("validation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => row.id);
  } catch (error) {
    console.error("getApprovedPropertyIds error", error);
    return [];
  }
};

export const getSimilarProperties = async (
  category: Property["transaction"],
  city: string,
  limit = 4,
  excludeId?: string
) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, description, price, category, status, location, specs, details, features, images, agent, created_at, validation_status")
      .eq("validation_status", "approved")
      .eq("status", "disponible")
      .eq("location->>city", city)
      .eq("category", category)
      .neq("id", excludeId ?? "")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapProperty);
  } catch (error) {
    console.error("getSimilarProperties error", error);
    return [];
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("deleteProperty error", error);
    return false;
  }
};

