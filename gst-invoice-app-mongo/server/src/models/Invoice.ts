// server/src/models/Invoice.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the structure for items within an invoice
interface IInvoiceItem {
  description: string;
  hsnSac?: string;
  quantity: number;
  rate: number;
  gstRate: number; // Store as percentage value, e.g., 18
  amount: number; // Calculated total for the item (qty * rate * (1 + gstRate/100))
}

// Define the main Invoice structure
export interface IInvoice extends Document {
  invoiceNumber: string; // Should be unique within a business
  invoiceDate: Date;
  dueDate: Date;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'UNPAID';
  notes?: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number; // Use if dealing with inter-state transactions
  total: number;
  business: Types.ObjectId; // Link to the Business
  client: Types.ObjectId;   // Link to the Client
  items: IInvoiceItem[];
}

const InvoiceItemSchema: Schema = new Schema({
  description: { type: String, required: true },
  hsnSac: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
}, { _id: false }); // Don't create separate IDs for sub-documents unless needed

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'UNPAID'],
    default: 'DRAFT',
    required: true,
  },
  notes: { type: String },
  subtotal: { type: Number, required: true, min: 0 },
  cgstAmount: { type: Number, default: 0, min: 0 },
  sgstAmount: { type: Number, default: 0, min: 0 },
  igstAmount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [InvoiceItemSchema], // Array of items
}, { timestamps: true });

// Ensure invoiceNumber is unique per business
InvoiceSchema.index({ business: 1, invoiceNumber: 1 }, { unique: true });
// Index for faster querying by status and date
InvoiceSchema.index({ business: 1, status: 1 });
InvoiceSchema.index({ business: 1, invoiceDate: -1 }); // -1 for descending sort

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);