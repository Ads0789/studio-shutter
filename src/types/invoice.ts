export interface UserDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  state: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

export interface WeddingEvent {
  id: string;
  name:string;
  team: string;
  deliverables: string;
}

export interface PaymentDetails {
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  amountReceived: number;
}

export interface Branding {
  logo: string; // will store data URL
  watermark: boolean;
  theme: "gold" | "royalBlue" | "pastelPink" | "classicBlack";
  signature: string; // text or data URL for image
}

export interface InvoiceState {
  company: UserDetails;
  client: UserDetails;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  events: WeddingEvent[];
  payment: PaymentDetails;
  branding: Branding;
  notes: string;
}

export interface InvoiceTotals {
    subTotal: number;
    totalIgst: number;
    totalCgst: number;
    totalSgst: number;
    grandTotal: number;
    balanceDue: number;
    isIntraState: boolean;
}
