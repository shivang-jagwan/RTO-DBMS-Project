import { Car, AlertTriangle, CircleDollarSign, CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/lib/types'

const iconMap = {
  totalVehicles: <Car className="h-4 w-4 text-muted-foreground" />,
  pendingChallans: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
  totalFineCollected: <CircleDollarSign className="h-4 w-4 text-muted-foreground" />,
  violationsToday: <CalendarClock className="h-4 w-4 text-muted-foreground" />,
}

interface DashboardCardsProps {
  stats: DashboardStats;
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          {iconMap.totalVehicles}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVehicles.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Challans</CardTitle>
          {iconMap.pendingChallans}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingChallans.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fine Collected</CardTitle>
          {iconMap.totalFineCollected}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{stats.totalFineCollected.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Violations Today</CardTitle>
          {iconMap.violationsToday}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.violationsToday.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  )
}
