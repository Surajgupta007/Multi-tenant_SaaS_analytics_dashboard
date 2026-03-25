'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarProps {
  orgSlug: string
  className?: string
}

export default function Sidebar({ orgSlug, className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { name: 'Dashboard', href: `/${orgSlug}/dashboard`, icon: LayoutDashboard },
    { name: 'Workspaces', href: `/${orgSlug}/workspaces`, icon: FolderKanban },
    { name: 'Members', href: `/${orgSlug}/members`, icon: Users },
    { name: 'Billing', href: `/${orgSlug}/billing`, icon: CreditCard },
    { name: 'Settings', href: `/${orgSlug}/settings`, icon: Settings },
  ]

  return (
    <div className={cn("hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-gray-900", className)}>
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white font-semibold">
          <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs">S</span>
          </div>
          <span className="truncate">{orgSlug}</span>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto p-4">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          const Icon = link.icon
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-gray-800 p-4">
        <div className="flex items-center gap-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-gray-800 text-gray-300">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium text-white">{session?.user?.name}</span>
            <span className="truncate text-xs text-gray-400">{session?.user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
