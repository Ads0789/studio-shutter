"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface TotalsSummaryProps {
  subTotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  amountReceived: number;
  balanceDue: number;
  isIntraState: boolean;
}

const SummaryRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({
  subTotal,
  totalCgst,
  totalSgst,
  totalIgst,
  grandTotal,
  amountReceived,
  balanceDue,
  isIntraState,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <SummaryRow label="Sub-total" value={formatCurrency(subTotal)} />
          {isIntraState ? (
            <>
              <SummaryRow label="CGST" value={formatCurrency(totalCgst)} />
              <SummaryRow label="SGST" value={formatCurrency(totalSgst)} />
            </>
          ) : (
            <SummaryRow label="IGST" value={formatCurrency(totalIgst)} />
          )}
        </div>
        <Separator />
        <div className="space-y-2">
            <div className="flex justify-between items-center text-base font-semibold">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
            </div>
        </div>
        <Separator />
         <div className="space-y-2">
          <SummaryRow label="Amount Received" value={formatCurrency(amountReceived)} />
          <div className="flex justify-between items-center text-base font-semibold text-primary">
                <span>Balance Due</span>
                <span>{formatCurrency(balanceDue)}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
