import mongoose, { Schema } from 'mongoose'
import { IOrganisation } from '@/types'

const organisationSchema = new Schema<IOrganisation>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'suspended', 'cancelled'], default: 'active' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    stripeCurrentPeriodEnd: { type: Date },
    maxWorkspaces: { type: Number, default: 1 },
    maxMembers: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Organisation = mongoose.models.Organisation || mongoose.model<IOrganisation>('Organisation', organisationSchema)
