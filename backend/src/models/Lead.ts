import { model, Schema } from "mongoose";
import { LeadSource, LeadStatus, MongoId } from "../types";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: MongoId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.New },
    source: { type: String, enum: Object.values(LeadSource), required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = model<ILead>("Lead", leadSchema);
