import { connectDB } from '@/lib/db/mongoose'
import { resolveOrg } from '@/lib/utils/tenant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RoleGate from '@/components/shared/RoleGate'
import { redirect } from 'next/navigation'

export default async function SettingsPage({ params }: { params: { orgSlug: string } }) {
  await connectDB()
  const org = await resolveOrg(params.orgSlug)

  if (!org) redirect('/login')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage organization preferences and configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>Update your organization's display name and URL slug.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Organization Name</label>
              <Input id="name" defaultValue={org.name} readOnly={true} />
              <p className="text-xs text-muted-foreground">Contact support to change organization name.</p>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border">
                  app.example.com/
                </span>
                <Input id="slug" defaultValue={org.slug} readOnly={true} />
              </div>
            </div>

            <RoleGate requiredRole="owner">
              <Button disabled variant="outline">Save Changes</Button>
            </RoleGate>
          </form>
        </CardContent>
      </Card>

      <RoleGate requiredRole="owner">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible destructive actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-sm">Delete Organization</p>
                <p className="text-sm text-muted-foreground">Permanently delete this organization and all its data.</p>
              </div>
              <Button variant="destructive" disabled>Delete</Button>
            </div>
          </CardContent>
        </Card>
      </RoleGate>
    </div>
  )
}
