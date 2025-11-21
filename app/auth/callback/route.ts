import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. On récupère l'URL actuelle (que ce soit localhost ou vercel)
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 2. On redirige vers la même origine qui a appelé
      // Si tu es sur localhost, origin sera "http://localhost:3000"
      // Si tu es sur Vercel, origin sera "https://dousell-immo.vercel.app"
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

