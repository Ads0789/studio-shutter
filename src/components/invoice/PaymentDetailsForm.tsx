"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import QRCode from "qrcode.react";
import type { PaymentDetails } from "@/types/invoice";

interface PaymentDetailsFormProps {
  payment: PaymentDetails;
  onPaymentChange: (field: keyof PaymentDetails, value: any) => void;
  grandTotal: number;
  companyName: string;
}

export const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  payment,
  onPaymentChange,
  grandTotal,
  companyName,
}) => {
  const qrValue = React.useMemo(() => {
    if (payment.upiId) {
      return `upi://pay?pa=${payment.upiId}&pn=${encodeURIComponent(
        companyName || "Merchant"
      )}&am=${grandTotal.toFixed(2)}&cu=INR`;
    }
    if (payment.bankName && payment.accountNumber && payment.ifscCode) {
      return `Bank Details:\nName: ${companyName}\nBank: ${payment.bankName}\nA/C: ${payment.accountNumber}\nIFSC: ${payment.ifscCode}`;
    }
    return "";
  }, [payment, grandTotal, companyName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter bank or UPI details to generate a QR code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {qrValue && (
          <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
            <QRCode value={qrValue} size={128} />
            <p className="mt-2 text-xs text-muted-foreground">
              Scan to pay {grandTotal > 0 ? `₹${grandTotal.toFixed(2)}` : ""}
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="upiId">UPI ID</Label>
          <Input
            id="upiId"
            value={payment.upiId}
            onChange={(e) => onPaymentChange("upiId", e.target.value)}
          />
        </div>
        <div className="text-center my-2 text-xs text-muted-foreground">OR</div>
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            value={payment.bankName}
            onChange={(e) => onPaymentChange("bankName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            value={payment.accountNumber}
            onChange={(e) => onPaymentChange("accountNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ifscCode">IFSC Code</Label>
          <Input
            id="ifscCode"
            value={payment.ifscCode}
            onChange={(e) => onPaymentChange("ifscCode", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
