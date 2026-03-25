import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg } from '@/lib/utils/tenant'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { orgSlug: string }
}) {
  await connectDB()
  const org = await resolveOrg(params.orgSlug)
  if (!org) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      {/* Sidebar is a Client Component */}
      <Sidebar orgSlug={params.orgSlug} />
      <div className="flex w-full flex-col lg:pl-64">
        {/* Header is a Client Component */}
        <Header orgSlug={params.orgSlug} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
