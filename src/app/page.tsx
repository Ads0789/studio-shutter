"use client";

import * as React from "react";
import ReactToPrint from "react-to-print";
import {
  type InvoiceState,
  type InvoiceItem,
  type WeddingEvent,
} from "@/types/invoice";
import { sampleInvoice } from "@/lib/sample-data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { indianStates } from "@/lib/states";

import { Header } from "@/components/invoice/Header";
import { Branding } from "@/components/invoice/Branding";
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
import { Printer } from "lucide-react";

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
  },
  notes: "Thank you for your business. Please make payment by the due date.",
};

const PrintButton = () => {
  const printRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <InvoicePreviewWrapper ref={printRef} />
      <ReactToPrint
        trigger={() => (
            <Button size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
        )}
        content={() => printRef.current}
      />
    </>
  );
};

const InvoicePreviewWrapper = React.forwardRef<HTMLDivElement>((props, ref) => {
    const [data, setData] = React.useState<InvoiceState>(initialInvoice);

    React.useEffect(() => {
        const savedData = localStorage.getItem("vivaahVistaData");
        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (error) {
                console.error("Failed to parse saved data:", error);
            }
        }
    }, []);

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


    return (
        <div className="hidden">
            <InvoicePreview 
            ref={ref} 
            data={data} 
            totals={{ subTotal, grandTotal, balanceDue, totalCgst, totalSgst, totalIgst, isIntraState }} 
            />
        </div>
    );
});

InvoicePreviewWrapper.displayName = 'InvoicePreviewWrapper';


export default function InvoicePage() {
  const [data, setData] = React.useState<InvoiceState>(initialInvoice);
  const [isClient, setIsClient] = React.useState(false);

  const { toast } = useToast();

  React.useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("vivaahVistaData");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved data:", error);
        localStorage.removeItem("vivaahVistaData");
      }
    } else {
        localStorage.setItem("vivaahVistaData", JSON.stringify(initialInvoice));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("vivaahVistaData", JSON.stringify(data));
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

  const handleSimpleChange = (field: "invoiceNumber" | "notes", value: string) => {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onSave={handleSave}
        onLoadSample={handleLoadSample}
      >
        <PrintButton />
      </Header>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
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
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 self-start">
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
          </div>
        </div>
      </main>
    </div>
  );
}
