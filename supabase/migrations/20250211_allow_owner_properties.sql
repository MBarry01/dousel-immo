-- Migration: allow authenticated users to manage their own properties
-- This complements the admin-only policies added previously.

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow owners to insert their own properties
DROP POLICY IF EXISTS "Users can insert their own properties" ON public.properties;
CREATE POLICY "Users can insert their own properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Allow owners to view their own properties
DROP POLICY IF EXISTS "Users can view their own properties" ON public.properties;
CREATE POLICY "Users can view their own properties"
  ON public.properties
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Allow owners to update their own properties (e.g. editing listing)
DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
CREATE POLICY "Users can update their own properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- (Optionally) allow owners to delete their properties before validation
DROP POLICY IF EXISTS "Users can delete their own properties" ON public.properties;
CREATE POLICY "Users can delete their own properties"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

COMMENT ON POLICY "Users can insert their own properties" ON public.properties IS
  $$Autorise les utilisateurs authentifiés à créer une annonce en tant que propriétaire.$$;
COMMENT ON POLICY "Users can view their own properties" ON public.properties IS
  $$Permet à chaque propriétaire de consulter ses annonces (ex: /compte/mes-biens).$$;
COMMENT ON POLICY "Users can update their own properties" ON public.properties IS
  $$Autorise la modification d'une annonce par son propriétaire tant qu'il est connecté.$$;
COMMENT ON POLICY "Users can delete their own properties" ON public.properties IS
  $$Permet au propriétaire de supprimer son annonce avant validation.$$;

