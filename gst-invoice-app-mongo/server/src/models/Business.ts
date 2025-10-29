import mongoose, { Document, Schema } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  address?: string;
  gstin?: string;
  user: mongoose.Schema.Types.ObjectId;
  logoUrl?: string;
}

const BusinessSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  gstin: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  logoUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IBusiness>('Business', BusinessSchema);