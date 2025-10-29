// server/src/models/Client.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClient extends Document {
  name: string;
  address?: string;
  gstin?: string;
  contact?: string;
  business: Types.ObjectId; // Reference to the Business
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  gstin: { type: String },
  contact: { type: String },
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true }, // Link to Business
}, { timestamps: true });

// Add an index for faster searching by business and name (optional but good)
ClientSchema.index({ business: 1, name: 1 });

export default mongoose.model<IClient>('Client', ClientSchema);