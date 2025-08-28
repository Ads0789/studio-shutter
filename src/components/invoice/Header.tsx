
"use client";

import { Button } from "@/components/ui/button";
import { Save, Sparkles } from "lucide-react";
import * as React from "react";

interface HeaderProps {
  onSave: () => void;
  onLoadSample: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  onLoadSample,
  children,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-primary font-headline">
          SHUTTER SURPRISE STUDIO
        </h1>
        <div className="flex items-center gap-2">
           <Button
            variant="outline"
            size="sm"
            onClick={onLoadSample}
            className="hidden sm:inline-flex"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          {children}
           <Button
            variant="ghost"
            size="icon"
            onClick={onLoadSample}
            className="sm:hidden"
            aria-label="Load Sample"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
