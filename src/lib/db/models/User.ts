import mongoose, { Schema } from 'mongoose'
import { IUser } from '@/types'

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: { type: String },
    stripeCustomerId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
