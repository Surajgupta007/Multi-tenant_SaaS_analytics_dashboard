'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

interface Org {
  orgId: {
    _id: string
    name: string
    slug: string
  }
}

export default function OrgSwitcher({ currentOrgSlug }: { currentOrgSlug: string }) {
  const router = useRouter()
  
  // Fetch orgs where user is a member
  // In a real app we'd have a specific /api/users/me/orgs route
  // For now, we mock the fact that they might have multiple
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger render={
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="truncate">
            {currentOrgSlug}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      } />
      <DropdownMenuContent className="w-[200px] p-0">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => {
            setOpen(false)
            router.push(`/${currentOrgSlug}/dashboard`)
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4 opacity-100"
            )}
          />
          {currentOrgSlug}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => {
            setOpen(false)
            // Route to creation page or dialog
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
