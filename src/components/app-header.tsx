'use client'

import { CircleUser, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { logout } from '@/lib/actions'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export function AppHeader() {
  const { user, isDemoMode, setDemoMode, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    if (isDemoMode) {
      setDemoMode(false)
      toast({ title: 'Exited Demo Mode' })
      router.push('/login')
      return
    }
    await logout()
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' })
    router.push('/login')
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        {isDemoMode && (
          <Alert variant="destructive" className="hidden sm:flex items-center p-2 pr-4 border-yellow-500/50 text-yellow-600 bg-yellow-50">
            <AlertDescription className="text-sm">
              ⚠️ You’re in Demo Mode — Data is not saved.
            </AlertDescription>
          </Alert>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {isDemoMode
                ? 'Demo User'
                : user?.email
                ? user.email
                : 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isDemoMode ? 'Exit Demo Mode' : 'Logout'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
