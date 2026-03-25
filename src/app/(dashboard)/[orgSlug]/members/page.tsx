'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface PopulatedMember {
  _id: string
  userId: { _id: string, name: string, email: string, image?: string }
  role: 'owner' | 'admin' | 'member'
  createdAt: string
}

export default function MembersPage({ params }: { params: { orgSlug: string } }) {
  const { data: members = [], isLoading } = useQuery<PopulatedMember[]>({
    queryKey: ['members', params.orgSlug],
    queryFn: async () => {
      const res = await fetch('/api/members', {
        headers: { 'x-org-slug': params.orgSlug }
      })
      if (!res.ok) throw new Error('Failed to fetch members')
      return res.json()
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground mt-2">Manage who has access to your organization.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
            ) : members.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No members found</TableCell></TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member._id}>
                  <TableCell className="flex items-center gap-3 font-medium">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.userId.image} />
                      <AvatarFallback>{member.userId.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{member.userId.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{member.userId.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'owner' ? 'default' : member.role === 'admin' ? 'secondary' : 'outline'}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
