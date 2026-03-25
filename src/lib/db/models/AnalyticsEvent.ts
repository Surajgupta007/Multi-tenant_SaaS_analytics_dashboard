import mongoose, { Schema } from 'mongoose'
import { IAnalyticsEvent } from '@/types'

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    orgId: { type: String, required: true, ref: 'Organisation' },
    workspaceId: { type: String, required: true, ref: 'Workspace' },
    event: { type: String, required: true },
    userId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

analyticsEventSchema.index({ orgId: 1, createdAt: -1 })

export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema)
