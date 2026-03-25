'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Organization Details
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterAndCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Create the user
      const userRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!userRes.ok) {
        const error = await userRes.json()
        throw new Error(error.error || 'Failed to create user')
      }

      // 2. Sign in the user automatically
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (signInRes?.error) {
        throw new Error('Failed to auto-login. Please try logging in manually.')
      }

      // 3. Create the organization using standard protected route
      const orgRes = await fetch('/api/orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName, slug: orgSlug }),
      })

      if (!orgRes.ok) {
        const error = await orgRes.json()
        throw new Error(error.error || 'Failed to create organization')
      }

      const org = await orgRes.json()
      toast.success('Account and Organization created successfully!')
      router.push(`/${org.slug}/dashboard`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen py-12 items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>

      <Card className="w-full max-w-md relative z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Sign Up</CardTitle>
          <CardDescription>Create your account and first organization</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterAndCreateOrg} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">Account Details</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">Organization</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <Input required value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Corp" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <Input required value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)} placeholder="acme-corp" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Creating Sandbox...' : 'Complete Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
