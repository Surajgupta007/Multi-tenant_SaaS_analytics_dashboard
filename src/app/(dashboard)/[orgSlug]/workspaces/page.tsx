'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import RoleGate from '@/components/shared/RoleGate'
import { IWorkspace } from '@/types'

export default function WorkspacesPage({ params }: { params: { orgSlug: string } }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const { data: workspaces = [], isLoading } = useQuery<IWorkspace[]>({
    queryKey: ['workspaces', params.orgSlug],
    queryFn: async () => {
      const res = await fetch('/api/workspaces', {
        headers: {
          'x-org-slug': params.orgSlug,
          // Note: In a real app, x-user-id is injected by middleware
        }
      })
      if (!res.ok) throw new Error('Failed to fetch workspaces')
      return res.json()
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: { name: string, slug: string }) => {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-org-slug': params.orgSlug },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create workspace')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', params.orgSlug] })
      toast.success('Workspace created')
      setName('')
      setSlug('')
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/workspaces?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-org-slug': params.orgSlug }
      })
      if (!res.ok) throw new Error('Failed to delete workspace')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', params.orgSlug] })
      toast.success('Workspace deleted')
    },
    onError: (error: Error) => toast.error(error.message)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
        <p className="text-muted-foreground mt-2">Manage your organization's workspaces.</p>
      </div>

      <RoleGate requiredRole="admin">
        <Card>
          <CardHeader>
            <CardTitle>Create Workspace</CardTitle>
            <CardDescription>Add a new workspace to your organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                createMutation.mutate({ name, slug })
              }}
              className="flex items-end gap-4"
            >
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="name" className="text-sm font-medium leading-none">Name</label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Marketing" required />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="slug" className="text-sm font-medium leading-none">Slug</label>
                <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="marketing" required />
              </div>
              <Button type="submit" disabled={createMutation.isPending}>Create</Button>
            </form>
          </CardContent>
        </Card>
      </RoleGate>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : workspaces.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No workspaces found</TableCell></TableRow>
            ) : (
              workspaces.map((ws) => (
                <TableRow key={ws._id}>
                  <TableCell className="font-medium">{ws.name}</TableCell>
                  <TableCell>{ws.slug}</TableCell>
                  <TableCell>{new Date(ws.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <RoleGate requiredRole="admin">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteMutation.mutate(ws._id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </RoleGate>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
