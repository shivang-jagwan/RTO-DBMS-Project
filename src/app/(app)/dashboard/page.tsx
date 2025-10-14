import { createClient } from '@/lib/supabase/server'
import { DashboardCards } from '@/components/dashboard-cards'
import { ViolationsChart } from '@/components/violations-chart'
import type { DashboardStats, ChartData } from '@/lib/types'

async function getDashboardData(): Promise<{ stats: DashboardStats, chartData: ChartData }> {
  const supabase = createClient()
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { count: totalVehicles } = await supabase.from('vehicle').select('*', { count: 'exact', head: true });
  const { count: pendingChallans } = await supabase.from('violation').select('*', { count: 'exact', head: true }).eq('status', 'Unpaid');
  const { data: paidFines, error: paidFinesError } = await supabase.from('violation').select('fine').eq('status', 'Paid');
  const { count: violationsToday } = await supabase.from('violation').select('*', { count: 'exact', head: true }).gte('date', today.toISOString()).lt('date', tomorrow.toISOString());
  const { count: paidCount } = await supabase.from('violation').select('*', { count: 'exact', head: true }).eq('status', 'Paid');

  const totalFineCollected = paidFines ? paidFines.reduce((sum, item) => sum + item.fine, 0) : 0;
  
  const stats: DashboardStats = {
    totalVehicles: totalVehicles ?? 0,
    pendingChallans: pendingChallans ?? 0,
    totalFineCollected: totalFineCollected,
    violationsToday: violationsToday ?? 0,
  }

  const chartData: ChartData = {
    paid: paidCount ?? 0,
    unpaid: pendingChallans ?? 0,
  }

  return { stats, chartData }
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
