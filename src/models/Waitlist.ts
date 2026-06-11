import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWaitlist extends Document {
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  industry: string;
  frameworks: string[];
  painPoints: string;
  interest: "newsletter" | "launch" | "partner";
  consentedAt: Date;
  confirmationSent: boolean;
  confirmationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    orgName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true },
    industry: { type: String, required: true },
    frameworks: [{ type: String }],
    painPoints: { type: String, default: "" },
    interest: {
      type: String,
      enum: ["newsletter", "launch", "partner"],
      default: "newsletter",
    },
    consentedAt: { type: Date, required: true },
    confirmationSent: { type: Boolean, default: false },
    confirmationSentAt: Date,
  },
  { timestamps: true }
);

/* prevent duplicate emails */
WaitlistSchema.index({ email: 1 }, { unique: true });

const Waitlist: Model<IWaitlist> =
  mongoose.models.Waitlist ||
  mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);

export default Waitlist;