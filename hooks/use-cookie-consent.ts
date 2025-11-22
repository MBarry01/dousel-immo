"use client";

import { useState, useEffect, useCallback } from "react";

export type CookieConsentStatus = "granted" | "denied" | null;

const COOKIE_CONSENT_KEY = "cookie-consent";

/**
 * Hook pour gérer le consentement aux cookies
 * Stocke le choix de l'utilisateur dans localStorage
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentStatus>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le consentement depuis localStorage au montage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored === "granted" || stored === "denied") {
        setConsent(stored);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du consentement:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour accepter les cookies
  const grantConsent = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "granted");
      setConsent("granted");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du consentement:", error);
    }
  }, []);

  // Fonction pour refuser les cookies
  const denyConsent = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "denied");
      setConsent("denied");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du refus:", error);
    }
  }, []);

  // Vérifier si le consentement a été donné
  const hasConsent = consent === "granted";

  // Vérifier si le consentement a été refusé
  const hasDenied = consent === "denied";

  // Vérifier si l'utilisateur a déjà fait un choix
  const hasAnswered = consent !== null;

  return {
    consent,
    isLoading,
    hasConsent,
    hasDenied,
    hasAnswered,
    grantConsent,
    denyConsent,
  };
}
