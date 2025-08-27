"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvoiceMetaFormProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  onSimpleChange: (field: "invoiceNumber", value: string) => void;
  onDateChange: (field: "invoiceDate" | "dueDate", value: string) => void;
}

export const InvoiceMetaForm: React.FC<InvoiceMetaFormProps> = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
  onSimpleChange,
  onDateChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => onSimpleChange("invoiceNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={invoiceDate}
            onChange={(e) => onDateChange("invoiceDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => onDateChange("dueDate", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
