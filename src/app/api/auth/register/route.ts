import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const existingUser = await User.findOne({ email }).lean()
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create a new user first to get the ID
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // Create the Stripe customer for them if key exists
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const { stripe } = await import('@/lib/stripe/client')
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user._id.toString() }
        })
        // Attach stripe ID back to the user
        user.stripeCustomerId = customer.id
        await user.save()
      } catch (e: any) {
        console.error("Stripe Skipped:", e.message)
      }
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
