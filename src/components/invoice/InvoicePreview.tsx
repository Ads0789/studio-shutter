"use client";

import * as React from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceState, InvoiceTotals } from "@/types/invoice";
import { Separator } from "../ui/separator";

interface InvoicePreviewProps {
  data: InvoiceState;
  totals: InvoiceTotals;
}

export const InvoicePreview = React.forwardRef<
  HTMLDivElement,
  InvoicePreviewProps
>(({ data, totals }, ref) => {
  const { company, client, invoiceNumber, invoiceDate, dueDate, items, events, payment, branding, notes } = data;
  const { subTotal, grandTotal, balanceDue, totalCgst, totalSgst, totalIgst, isIntraState } = totals;

  const amountInWords = (num: number): string => {
    // Basic implementation for converting numbers to words
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const number = parseFloat(num.toString().split('.')[0]);
    if(number.toString().length > 9) return 'overflow';
    const n = ('000000000' + number).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' thousand ' : '';
    str += (n[4] != '00') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    const rupees = str.trim().replace(/\s+/g, ' ');
    const paiseNum = num.toString().split('.')[1]
    const paise = paiseNum ? (a[Number(paiseNum)] || b[paiseNum[0]] + ' ' + a[paiseNum[1]]) : ''
    return `${rupees.charAt(0).toUpperCase() + rupees.slice(1)} Rupees` + (paise ? ` and ${paise} Paise` : '') + ' Only';
  };
  
  return (
    <div ref={ref} className="bg-white text-black text-sm p-12 font-serif" style={{width: '210mm', minHeight: '297mm'}}>
      <div className="relative z-10 flex flex-col" style={{minHeight: '267mm'}}>
      {branding.logo && branding.watermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0 pointer-events-none">
          <Image src={branding.logo} alt="Watermark" width={400} height={400} className="object-contain" data-ai-hint="logo"/>
        </div>
      )}
      <div className="flex-grow">
        <header className="flex justify-between items-start mb-8">
          <div>
            {branding.logo && <Image src={branding.logo} alt="Company Logo" width={100} height={100} className="object-contain mb-4" data-ai-hint="logo"/>}
            <h1 className="font-bold text-2xl uppercase text-neutral-800">{company.name}</h1>
            <p>{company.address}</p>
            <p>Email: {company.email} | Phone: {company.phone}</p>
            <p>GSTIN: {company.gstin}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-4xl uppercase text-neutral-600">Invoice</h2>
            <p className="mt-2"><span className="font-bold">#</span> {invoiceNumber}</p>
            <p><span className="font-bold">Date:</span> {invoiceDate}</p>
            <p><span className="font-bold">Due Date:</span> {dueDate}</p>
          </div>
        </header>

        <section className="mb-8">
          <h3 className="font-bold uppercase text-neutral-600 border-b pb-1 mb-2">Bill To</h3>
          <p className="font-bold text-lg text-neutral-800">{client.name}</p>
          <p>{client.address}</p>
          <p>Email: {client.email} | Phone: {client.phone}</p>
          <p>GSTIN: {client.gstin}</p>
          <p>Place of Supply: {client.state}</p>
        </section>

        <section className="mb-8">
          <table className="w-full text-left">
            <thead className="bg-neutral-100">
              <tr>
                <th className="p-2 w-8">#</th>
                <th className="p-2 w-1/2">Item & Description</th>
                <th className="p-2">HSN/SAC</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Rate</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.hsn}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{formatCurrency(item.rate)}</td>
                  <td className="p-2 text-right">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex justify-end mb-8">
          <div className="w-1/2 space-y-2">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal:</span> <span>{formatCurrency(subTotal)}</span></div>
            {isIntraState ? (
              <>
              <div className="flex justify-between"><span className="text-neutral-600">CGST:</span> <span>{formatCurrency(totalCgst)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600">SGST:</span> <span>{formatCurrency(totalSgst)}</span></div>
              </>
            ) : (
              <div className="flex justify-between"><span className="text-neutral-600">IGST:</span> <span>{formatCurrency(totalIgst)}</span></div>
            )}
            <Separator/>
            <div className="flex justify-between font-bold text-lg"><span className="text-neutral-800">Total:</span> <span>{formatCurrency(grandTotal)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Amount Paid:</span> <span>- {formatCurrency(payment.amountReceived)}</span></div>
            <Separator/>
            <div className="flex justify-between font-bold text-xl bg-neutral-100 p-2 rounded"><span className="text-neutral-800">Balance Due:</span> <span>{formatCurrency(balanceDue)}</span></div>
          </div>
        </section>

        <section className="mb-8 text-sm">
          <p><span className="font-bold">Amount in words:</span> {amountInWords(grandTotal)}</p>
        </section>
        
        {events.length > 0 && (
          <section className="mb-8" style={{ breakInside: 'avoid-page' }}>
            <h3 className="font-bold uppercase text-neutral-600 border-b pb-1 mb-2">Event Summary</h3>
            {events.map(event => (
              <div key={event.id} className="mb-4" style={{ breakInside: 'avoid' }}>
                <h4 className="font-bold text-neutral-800">{event.name}</h4>
                <p className="text-xs text-neutral-600"><span className="font-bold">Team:</span> {event.team}</p>
                <div className="text-xs text-neutral-600 whitespace-pre-wrap"><span className="font-bold">Deliverables:</span>{'\n'}{event.deliverables}</div>
              </div>
            ))}
          </section>
        )}
      </div>
      
      <footer className="text-xs text-neutral-600 space-y-4 pt-8 border-t border-neutral-200 mt-auto">
        <div className="whitespace-pre-wrap"><span className="font-bold">Notes / Terms:</span>{'\n'}{notes}</div>
        <div>
          <p className="font-bold uppercase text-neutral-800">Payment Information</p>
          <p>Bank: {payment.bankName}, A/C: {payment.accountNumber}, IFSC: {payment.ifscCode}</p>
          <p>UPI ID: {payment.upiId}</p>
        </div>
        <div className="text-center pt-8">
          <p>This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </footer>
      </div>
    </div>
  );
});

InvoicePreview.displayName = "InvoicePreview";
