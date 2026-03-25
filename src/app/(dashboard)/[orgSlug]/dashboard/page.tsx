import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg } from '@/lib/utils/tenant'
import { Member } from '@/lib/db/models/Member'
import { Workspace } from '@/lib/db/models/Workspace'
import { AnalyticsEvent } from '@/lib/db/models/AnalyticsEvent'
import StatsCard from '@/components/dashboard/StatsCard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import ActiveUsersChart from '@/components/dashboard/ActiveUsersChart'
import { Activity, Users, LayoutDashboard, Database } from 'lucide-react'

export default async function DashboardPage({ params }: { params: { orgSlug: string } }) {
  await connectDB()
  const org = await resolveOrg(params.orgSlug)

  if (!org) {
    return null // Layout redirect handles this
  }

  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const [members, workspaces, events] = await Promise.all([
    Member.countDocuments({ orgId: org._id }),
    Workspace.countDocuments({ orgId: org._id }),
    AnalyticsEvent.countDocuments({
      orgId: org._id,
      createdAt: { $gte: firstDayOfMonth },
    }),
  ])

  // Mock data for charts
  const revenueLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const revenueData = [1200, 2100, 1800, 2400, 3200, 2800, 4100]
  
  const userLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const userData = [40, 52, 38, 65, 80, 42, 35]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your organization's performance and usage metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Members" 
          value={members.toString()} 
          delta={+12} 
          icon={<Users className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Active Workspaces" 
          value={workspaces.toString()} 
          delta={+5} 
          icon={<LayoutDashboard className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Events This Month" 
          value={events.toLocaleString()} 
          delta={-2} 
          icon={<Activity className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Database Usage" 
          value="45%" 
          delta={0} 
          icon={<Database className="h-4 w-4" />} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Revenue trend</h3>
          </div>
          <div className="p-6 pt-0">
            <RevenueChart labels={revenueLabels} data={revenueData} />
          </div>
        </div>
        
        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight">Active users</h3>
          </div>
          <div className="p-6 pt-0">
            <ActiveUsersChart labels={userLabels} data={userData} />
          </div>
        </div>
      </div>
    </div>
  )
}
