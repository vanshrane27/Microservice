import mongoose, { Document, Schema } from 'mongoose';

export interface ITrafficLog extends Document {
  ipAddress: string;
  productUrl: string;
  date: Date;
  city?: string;
  country?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  organization?: string;
  isPrivateIP: boolean;
  error?: {
    message: string;
    code?: string;
  };
}

const TrafficLogSchema: Schema = new Schema({
  ipAddress: { type: String, required: true },
  productUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  city: { type: String },
  country: { type: String },
  region: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  organization: { type: String },
  isPrivateIP: { type: Boolean, required: true },
  error: {
    message: { type: String },
    code: { type: String }
  }
});

export const TrafficLog = mongoose.model<ITrafficLog>('TrafficLog', TrafficLogSchema); 