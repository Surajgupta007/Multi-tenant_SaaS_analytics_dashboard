import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await connectDB()
        const user = await User.findOne({ email: credentials.email }).select('+password').lean() as any
        
        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isMatch = await bcrypt.compare(credentials.password as string, user.password as string)
        if (!isMatch) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
