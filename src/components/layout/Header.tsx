'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from './Sidebar'
import OrgSwitcher from './OrgSwitcher'

export default function Header({ orgSlug }: { orgSlug: string }) {
  const pathname = usePathname()
  
  // Try to extract a clean title from the pathname
  const segments = pathname.split('/').filter(Boolean)
  const currentSegment = segments[segments.length - 1]
  const title = currentSegment ? currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1) : 'Dashboard'

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b bg-background/95 backdrop-blur px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-x-4 lg:hidden">
        <Sheet>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-gray-700">
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          } />
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar orgSlug={orgSlug} className="relative flex" />
          </SheetContent>
        </Sheet>
        <div className="flex items-center font-semibold">{title}</div>
      </div>
      
      <div className="hidden lg:flex flex-1 items-center">
        <div className="text-sm border-l-2 border-primary/20 pl-4 font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <OrgSwitcher currentOrgSlug={orgSlug} />
      </div>
    </header>
  )
}
