import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName?: string;
  phone?: string;
  notificationsOn: boolean;
  avatarUrl?: string;
  googleId?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },
  phone: { type: String },
  notificationsOn: { type: Boolean, default: true },
  avatarUrl: { type: String },
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);