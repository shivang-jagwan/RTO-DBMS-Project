import { createClient } from '@/lib/supabase/server'
import { DashboardCards } from '@/components/dashboard-cards'
import { ViolationsChart } from '@/components/violations-chart'
import { MOCK_DASHBOARD_STATS, MOCK_CHART_DATA } from '@/lib/mock-data'
import type { DashboardStats, ChartData } from '@/lib/types'
import { cookies } from 'next/headers'

// Dummy function to check for demo mode. In a real app, this might come from a cookie or context.
const isDemoMode = () => {
    return cookies().get('isDemoMode')?.value === 'true'
}

async function getDashboardData(): Promise<{ stats: DashboardStats, chartData: ChartData }> {
  // In a real application, you would fetch this data from your Supabase database.
  // For this example, we are using mock data.
  const supabase = createClient()
  
  // This is a placeholder for actual data fetching logic.
  // e.g. const { count: totalVehicles } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
  // etc.

  return {
    stats: MOCK_DASHBOARD_STATS,
    chartData: MOCK_CHART_DATA,
  }
}

export default async function DashboardPage() {
  const { stats, chartData } = await getDashboardData();
  
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <DashboardCards stats={stats} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
           {/* You can add another component here, like a list of recent violations */}
        </div>
        <div className="lg:col-span-3">
            <ViolationsChart data={chartData} />
        </div>
      </div>
    </div>
  )
}
