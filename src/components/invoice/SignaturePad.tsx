
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Pen } from "lucide-react";
import { Button } from "../ui/button";

interface SignaturePadProps {
  signature: string;
  onSignatureChange: (value: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ signature, onSignatureChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isImage = signature?.startsWith("data:image");

  const handleSignatureImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSignatureChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    onSignatureChange("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorized Signature</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isImage ? "upload" : "text"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text"><Pen className="mr-2 h-4 w-4"/>Type Signature</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload Image</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="pt-4">
             <div className="space-y-2">
                <Label htmlFor="signature-text">Type Name</Label>
                <Input
                    id="signature-text"
                    value={isImage ? "" : signature}
                    onChange={(e) => onSignatureChange(e.target.value)}
                    placeholder="Enter full name"
                    style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '1.5rem' }}
                />
            </div>
          </TabsContent>
          <TabsContent value="upload" className="pt-4">
            <div className="space-y-2">
                <Label htmlFor="signature-upload">Signature Image</Label>
                <div
                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/20 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isImage ? (
                    <div className="relative w-48 h-24">
                        <Image
                        src={signature}
                        alt="Signature Preview"
                        fill
                        style={{ objectFit: 'contain' }}
                        data-ai-hint="signature"
                        />
                    </div>
                    ) : (
                    <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                    </div>
                    )}
                </div>
                <Input
                    id="signature-upload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleSignatureImageChange}
                />
                 {signature && (
                    <Button onClick={handleRemoveSignature} variant="link" className="text-destructive text-xs p-0 h-auto">Remove Signature</Button>
                 )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
