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
  interest: "undecided" | "newsletter" | "launch" | "partner";
  consentedAt: Date;
  signupSession: string;
  freeEmailDomain: boolean;
  profileCompletedAt?: Date;
  extrasCompletedAt?: Date;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
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
    },
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    orgName: { type: String, default: "", trim: true },
    jobTitle: { type: String, default: "", trim: true },
    industry: { type: String, default: "", trim: true },
    frameworks: [{ type: String }],
    painPoints: { type: String, default: "" },
    interest: {
      type: String,
      enum: ["undecided", "newsletter", "launch", "partner"],
      default: "undecided",
    },
    consentedAt: { type: Date, required: true },
    signupSession: { type: String, default: "", select: false },
    freeEmailDomain: { type: Boolean, default: false },
    profileCompletedAt: Date,
    extrasCompletedAt: Date,
    utmSource: { type: String, default: "" },
    utmMedium: { type: String, default: "" },
    utmCampaign: { type: String, default: "" },
    referrer: { type: String, default: "" },
    confirmationSent: { type: Boolean, default: false },
    confirmationSentAt: Date,
  },
  { timestamps: true }
);

/* prevent duplicate emails (also creates the lookup index) */
WaitlistSchema.index({ email: 1 }, { unique: true });

const Waitlist: Model<IWaitlist> =
  mongoose.models.Waitlist ||
  mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);

export default Waitlist;
