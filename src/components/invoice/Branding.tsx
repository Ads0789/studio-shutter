"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import type { Branding } from "@/types/invoice";

interface BrandingProps {
  branding: Branding;
  onBrandingChange: (field: keyof Branding, value: any) => void;
}

export const Branding: React.FC<BrandingProps> = ({ branding, onBrandingChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onBrandingChange("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding & Appearance</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-2">
          <Label htmlFor="logo-upload">Company Logo</Label>
          <div
            className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/20 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {branding.logo ? (
              <div className="relative w-24 h-24">
                <Image
                  src={branding.logo}
                  alt="Company Logo Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                  data-ai-hint="logo"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click or drag to upload logo</p>
              </div>
            )}
          </div>
          <Input
            id="logo-upload"
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>PDF Watermark</Label>
                    <p className="text-xs text-muted-foreground">
                        Show logo as a faint watermark on the PDF.
                    </p>
                </div>
                <Switch
                    checked={branding.watermark}
                    onCheckedChange={(checked) => onBrandingChange("watermark", checked)}
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
