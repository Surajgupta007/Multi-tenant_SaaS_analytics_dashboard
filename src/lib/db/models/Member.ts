import mongoose, { Schema } from 'mongoose'
import { IMember } from '@/types'

const memberSchema = new Schema<IMember>(
  {
    userId: { type: String, required: true, ref: 'User' },
    orgId: { type: String, required: true, ref: 'Organisation' },
    workspaceId: { type: String, required: true, ref: 'Workspace' },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

memberSchema.index({ userId: 1, orgId: 1, workspaceId: 1 }, { unique: true })

export const Member = mongoose.models.Member || mongoose.model<IMember>('Member', memberSchema)
