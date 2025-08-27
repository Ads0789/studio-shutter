import { type InvoiceState } from "@/types/invoice";
import { format } from "date-fns";

export const sampleInvoice: InvoiceState = {
  company: {
    name: "SHUTTER SURPRISE STUDIO",
    address: "123 Celebration Avenue, Royal City, RC 400051",
    phone: "9876543210",
    email: "contact@shuttersurprise.com",
    gstin: "27ABCDE1234F1Z5",
    state: "Maharashtra",
  },
  client: {
    name: "Mr. & Mrs. Sharma",
    address: "456 Blissful Lane, Happy Colony, Pune, MH 411007",
    phone: "9988776655",
    email: "sharma.wedding@email.com",
    gstin: "27FGHIJ5678K1Z4",
    state: "Maharashtra",
  },
  invoiceNumber: `SSS-${new Date().getFullYear()}-001`,
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  dueDate: format(new Date(new Date().setDate(new Date().getDate() + 15)), "yyyy-MM-dd"),
  items: [
    {
      id: "1",
      description: "Full-Day Wedding Photography",
      hsn: "998341",
      quantity: 1,
      rate: 150000,
      gstRate: 18,
    },
    {
      id: "2",
      description: "Pre-Wedding Photoshoot (2 locations)",
      hsn: "998341",
      quantity: 1,
      rate: 40000,
      gstRate: 18,
    },
    {
      id: "3",
      description: "Cinematic Wedding Film (15-20 mins)",
      hsn: "998342",
      quantity: 1,
      rate: 80000,
      gstRate: 18,
    },
    {
      id: "4",
      description: "Custom-designed Photo Album (40 pages)",
      hsn: "490110",
      quantity: 2,
      rate: 15000,
      gstRate: 12,
    },
  ],
  events: [
    {
      id: "ev1",
      name: "Engagement Ceremony",
      team: "Ankit (Lead), Priya (Second Shooter)",
      deliverables: "- 200-250 Edited Photos\n- Online Gallery\n- 1-min Social Media Teaser",
    },
    {
      id: "ev2",
      name: "Wedding Day",
      team: "Ankit (Lead), Priya, Rohan (Video), Sameer (Drone)",
      deliverables: "- 600-800 Edited Photos\n- Full-length Cinematic Film\n- 3-min Highlight Reel\n- Drone Footage",
    },
  ],
  payment: {
    upiId: "shuttersurprise@upi",
    bankName: "Celebration Bank",
    accountNumber: "123456789012",
    ifscCode: "CELB0000123",
    amountReceived: 100000,
  },
  branding: {
    logo: "",
    watermark: true,
    theme: "gold",
  },
  notes: "Congratulations on your special day! We were honored to be a part of it.\n- 50% of the balance is due within 15 days.\n- Final deliverables will be provided after full payment.",
};
