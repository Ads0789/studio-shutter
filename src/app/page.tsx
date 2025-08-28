
"use client";

import * as React from "react";
import { useReactToPrint } from "react-to-print";
import {
  type InvoiceState,
  type InvoiceItem,
  type WeddingEvent,
} from "@/types/invoice";
import { sampleInvoice } from "@/lib/sample-data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { indianStates } from "@/lib/states";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Header } from "@/components/invoice/Header";
import { Branding } from "@/components/invoice/Branding";
import { SignaturePad } from "@/components/invoice/SignaturePad";
import { ClientSignaturePad } from "@/components/invoice/ClientSignaturePad";
import { UserDetailsForm } from "@/components/invoice/UserDetailsForm";
import { InvoiceMetaForm } from "@/components/invoice/InvoiceMetaForm";
import { InvoiceItemsTable } from "@/components/invoice/InvoiceItemsTable";
import { EventsModule } from "@/components/invoice/EventsModule";
import { PaymentDetailsForm } from "@/components/invoice/PaymentDetailsForm";
import { TotalsSummary } from "@/components/invoice/TotalsSummary";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, Eye, EyeOff, ChevronDown, FileImage } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialInvoice: InvoiceState = {
  company: {
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    state: "",
  },
  client: {
    name: "",
    address: "",
    phone: "",
    email: "",
    gstin: "",
    state: "",
  },
  invoiceNumber: "",
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  dueDate: format(new Date(), "yyyy-MM-dd"),
  items: [],
  events: [],
  payment: {
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    amountReceived: 0,
  },
  branding: {
    logo: "",
    watermark: true,
    theme: "gold",
    signature: ""
  },
  notes: "25% Advance Payment: To confirm the booking and secure the event date, a 25% advance payment is required at the time of booking.\n\n50% Payment: Due on the event date. This payment should be made before the event begins to ensure smooth execution.\n\n25% Final Payment: The remaining 25% balance is due after the completion of the event. Kindly settle the final payment within 7 days post-event.",
  clientSignature: "",
};

type DownloadQuality = "high" | "compressed" | "png";

const PrintButton = ({ printRef, data }: { printRef: React.RefObject<HTMLDivElement>, data: InvoiceState }) => {
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleDownload = async (quality: DownloadQuality) => {
      const input = printRef.current;
      if (!input) {
        console.error("Invoice preview element not found");
        return;
      }
      
      const canvas = await html2canvas(input, {
          scale: quality === "high" ? 3 : 1.5,
          useCORS: true,
          logging: false,
      });

      if (quality === 'png') {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `invoice-${data.invoiceNumber || 'download'}.png`;
        link.href = imgData;
        link.click();
        return;
      }

      const imgData = canvas.toDataURL(quality === 'high' ? 'image/png' : 'image/jpeg', quality === 'high' ? 1.0 : 0.95);
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [canvas.width * 0.264583, canvas.height * 0.264583],
      });
      
      pdf.addImage(imgData, quality === 'high' ? 'PNG' : 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), undefined, 'FAST');
      
      pdf.save(`invoice-${data.invoiceNumber || 'download'}.pdf`);
    };

    return (
      <div className="flex rounded-md border">
        <Button size="sm" onClick={handlePrint} variant="outline" className="rounded-r-none border-r-0">
            <Printer className="mr-2 h-4 w-4" />
            Print
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-l-none px-2">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload('high')}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>High Quality PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('compressed')}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Compressed PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('png')}>
                    <FileImage className="mr-2 h-4 w-4" />
                    <span>Download as PNG</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };


export default function InvoicePage() {
  const [data, setData] = React.useState<InvoiceState>(initialInvoice);
  const [isClient, setIsClient] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const printRef = React.useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  React.useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("shutterSurpriseStudioData");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved data:", error);
        localStorage.removeItem("shutterSurpriseStudioData");
      }
    } else {
        localStorage.setItem("shutterSurpriseStudioData", JSON.stringify(initialInvoice));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("shutterSurpriseStudioData", JSON.stringify(data));
  },[data])


  const handleSave = () => {
    toast({
      title: "Data Saved!",
      description: "Your invoice data has been saved to your browser.",
    });
  };

  const handleLoadSample = () => {
    setData(sampleInvoice);
    toast({
      title: "Sample Data Loaded!",
      description: "You can now see a sample invoice.",
    });
  };
  
  const handleGenericChange = <T extends keyof InvoiceState>(section: T, field: keyof InvoiceState[T], value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDateChange = (field: "invoiceDate" | "dueDate", value: string) => {
    setData(prev => ({...prev, [field]: value}));
  };

  const handleSimpleChange = (field: "invoiceNumber" | "notes" | "clientSignature", value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          description: "",
          hsn: "",
          quantity: 1,
          rate: 0,
          gstRate: 18,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleEventChange = (id: string, field: keyof WeddingEvent, value: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((event) =>
        event.id === id ? { ...event, [field]: value } : event
      ),
    }));
  };

  const addEvent = () => {
    setData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          id: crypto.randomUUID(),
          name: "New Event",
          team: "",
          deliverables: "",
        },
      ],
    }));
  };

  const removeEvent = (id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((event) => event.id !== id),
    }));
  };

  const handleBrandingChange = (field: keyof InvoiceState["branding"], value: any) => {
    handleGenericChange("branding", field, value);
  };

  const { subTotal, grandTotal, balanceDue, totalCgst, totalSgst, totalIgst, isIntraState } = React.useMemo(() => {
    const isIntraState = data.company.state && data.client.state && data.company.state === data.client.state;
    let subTotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    data.items.forEach(item => {
      const itemTotal = item.quantity * item.rate;
      subTotal += itemTotal;
      const gstAmount = itemTotal * (item.gstRate / 100);
      if (isIntraState) {
        totalCgst += gstAmount / 2;
        totalSgst += gstAmount / 2;
      } else {
        totalIgst += gstAmount;
      }
    });

    const grandTotal = subTotal + totalCgst + totalSgst + totalIgst;
    const balanceDue = grandTotal - (data.payment.amountReceived || 0);

    return { subTotal, grandTotal, balanceDue, totalCgst, totalSgst, totalIgst, isIntraState };
  }, [data.items, data.company.state, data.client.state, data.payment.amountReceived]);


  if (!isClient) {
    return null; // or a loading spinner
  }

  const totals = { subTotal, grandTotal, balanceDue, totalCgst, totalSgst, totalIgst, isIntraState };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header
        onSave={handleSave}
        onLoadSample={handleLoadSample}
      >
        <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
        <PrintButton printRef={printRef} data={data}/>
      </Header>
      <main className="flex-1 overflow-hidden">
        <div className={cn("grid h-full", showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
          <ScrollArea className="h-full">
            <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
              <Branding
                branding={data.branding}
                onBrandingChange={handleBrandingChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UserDetailsForm
                  title="Company Details"
                  data={data.company}
                  onDataChange={(field, value) => handleGenericChange('company', field, value)}
                  states={indianStates}
                />
                <UserDetailsForm
                  title="Client Details"
                  data={data.client}
                  onDataChange={(field, value) => handleGenericChange('client', field, value)}
                  states={indianStates}
                />
              </div>
              <InvoiceMetaForm 
                invoiceNumber={data.invoiceNumber}
                invoiceDate={data.invoiceDate}
                dueDate={data.dueDate}
                onSimpleChange={handleSimpleChange}
                onDateChange={handleDateChange}
              />
              <InvoiceItemsTable
                items={data.items}
                onItemChange={handleItemChange}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                isIntraState={isIntraState}
              />
              <EventsModule
                events={data.events}
                onEventChange={handleEventChange}
                onAddEvent={addEvent}
                onRemoveEvent={removeEvent}
              />
              <TotalsSummary 
                subTotal={subTotal}
                totalCgst={totalCgst}
                totalSgst={totalSgst}
                totalIgst={totalIgst}
                grandTotal={grandTotal}
                amountReceived={data.payment.amountReceived}
                balanceDue={balanceDue}
                isIntraState={isIntraState}
              />
              <PaymentDetailsForm
                payment={data.payment}
                onPaymentChange={(field, value) => handleGenericChange('payment', field, value)}
                grandTotal={grandTotal}
                companyName={data.company.name}
              />
               <SignaturePad 
                 signature={data.branding.signature}
                 onSignatureChange={(value) => handleBrandingChange('signature', value)}
               />
               <ClientSignaturePad
                  signature={data.clientSignature}
                  onSignatureChange={(value) => handleSimpleChange('clientSignature', value)}
                />
               <Card>
                <CardHeader>
                  <CardTitle>Notes / Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="notes" className="sr-only">Notes / Terms & Conditions</Label>
                  <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => handleSimpleChange('notes', e.target.value)}
                    rows={4}
                    placeholder="E.g., 50% advance payment required."
                  />
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
          
          {showPreview && (
             <div className="bg-muted/30 p-4 lg:p-8 h-full overflow-auto">
                <div className="bg-white shadow-lg mx-auto w-full max-w-[210mm]">
                    <InvoicePreview
                        ref={printRef}
                        data={data} 
                        totals={totals} 
                    />
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
