import mongoose, { Schema } from 'mongoose'
import { IWorkspace } from '@/types'

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    orgId: { type: String, required: true, ref: 'Organisation' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

workspaceSchema.index({ orgId: 1, slug: 1 }, { unique: true })

export const Workspace = mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', workspaceSchema)
