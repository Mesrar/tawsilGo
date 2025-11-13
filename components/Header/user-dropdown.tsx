"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  DollarSign,
  Truck,
  Building2,
  Users,
  TruckIcon,
  MapPin,
  Package
} from "lucide-react"
import { useTranslations } from 'next-intl'
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface UserDropdownProps {
  user: {
    name?: string | null | undefined
    email?: string | null | undefined
    image?: string | null | undefined
    role?: string | null | undefined
  }
}

interface MenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

// Get role-specific menu configuration
function getMenuConfig(role?: string | null): MenuItem[] {
  const normalizedRole = role?.toLowerCase()

  switch (normalizedRole) {
    case 'driver':
      return [
        { label: 'Dashboard', href: '/drivers/dashboard', icon: LayoutDashboard },
        { label: 'My Trips', href: '/drivers/dashboard/trips', icon: Truck },
        { label: 'Bookings', href: '/drivers/dashboard/available-orders', icon: Package },
        { label: 'My Performance', href: '/drivers/dashboard/my-performance', icon: Settings },
      ]

    case 'organization':
    case 'organization_admin':
    case 'organization_driver':
      return [
        { label: 'Company Profile', href: '/organizations/profile', icon: Building2 },
        { label: 'Team', href: '/organizations/team', icon: Users },
        { label: 'Fleet', href: '/organizations/fleet', icon: TruckIcon },
        { label: 'Trips', href: '/organizations/trips', icon: MapPin },
      ]

    case 'customer':
    default:
      return [
        { label: 'My Profile', href: '/users/profil', icon: User },
        { label: 'Settings', href: '/users/settings', icon: Settings },
        { label: 'My Shipments', href: '/users/shipments', icon: Package },
      ]
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const menuItems = getMenuConfig(user.role)

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname?.replace(/^\/(en|fr|ar)/, '') || ''

  const handleNavigation = async (href: string, label: string) => {
    // Check if already on this page
    if (currentPath === href) {
      toast({
        title: "Info",
        description: `You're already viewing ${label}`,
      })
      return
    }

    // Show loading state
    setIsNavigating(true)

    try {
      router.push(href)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to navigate to ${label}`,
        variant: "destructive",
      })
      setIsNavigating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User avatar"} />
            <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[280px] md:w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {menuItems.map((item) => {
          const isActive = currentPath === item.href
          const Icon = item.icon

          return (
            <DropdownMenuItem
              key={item.href}
              className={cn(
                "cursor-pointer min-h-[48px] md:min-h-[36px] px-3",
                isActive && "bg-accent text-accent-foreground"
              )}
              disabled={isActive || isNavigating}
              onSelect={(e) => {
                e.preventDefault()
                handleNavigation(item.href, item.label)
              }}
            >
              <Icon className="mr-2 h-[18px] w-[18px] md:h-4 md:w-4" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="text-xs text-muted-foreground ml-2">✓</span>
              )}
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer min-h-[48px] md:min-h-[36px] px-3"
          onSelect={(event) => {
            event.preventDefault()
            signOut({ callbackUrl: "/" })
          }}
        >
          <LogOut className="mr-2 h-[18px] w-[18px] md:h-4 md:w-4" />
          <span>{t('logOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
