"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

/**
 * Composant InfoTooltip - Affiche une icône "i" avec une info-bulle au survol/clic
 */
export function InfoTooltip({ content, className }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              // Empêcher le clic de se propager (ne pas sélectionner la carte)
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Empêcher le mousedown de se propager aussi
              e.stopPropagation();
            }}
            className={cn(
              "inline-flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent",
              className
            )}
            aria-label="Plus d'informations"
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[250px] bg-black/95 border-white/20 text-white text-sm p-3"
          sideOffset={8}
        >
          <p className="leading-relaxed">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

