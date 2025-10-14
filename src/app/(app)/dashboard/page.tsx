import { createClient } from '@/lib/supabase/server'
import { DashboardCards } from '@/components/dashboard-cards'
import { ViolationsChart } from '@/components/violations-chart'
import { TopOffenders } from '@/components/top-offenders'
import type { DashboardStats, ChartData, TopOffender } from '@/lib/types'

async function getDashboardData(): Promise<{ stats: DashboardStats, chartData: ChartData, topOffenders: TopOffender[] }> {
  const supabase = createClient()
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Stats for cards
  const { count: totalVehicles } = await supabase.from('vehicle').select('*', { count: 'exact', head: true });
  const { count: pendingChallans, error: pendingError } = await supabase.from('violation').select('*', { count: 'exact', head: true }).eq('paymentstatus', 'Unpaid');
  const { data: paidFines, error: paidFinesError } = await supabase.from('violation').select('fineamount').eq('paymentstatus', 'Paid');
  const { count: violationsToday, error: violationsTodayError } = await supabase.from('violation').select('*', { count: 'exact', head: true }).gte('lastnotificationat', today.toISOString()).lt('lastnotificationat', tomorrow.toISOString());

  const totalFineCollected = paidFines ? paidFines.reduce((sum, item) => sum + item.fineamount, 0) : 0;

  // Data for Paid vs Unpaid chart
  const { count: paidCount, error: paidCountError } = await supabase.from('violation').select('*', { count: 'exact', head: true }).eq('paymentstatus', 'Paid');

  // Data for Top Offenders
  const { data: offenderData, error: offenderError } = await supabase.rpc('get_top_offenders');

  if (pendingError || paidFinesError || violationsTodayError || paidCountError || offenderError) {
    console.error({ pendingError, paidFinesError, violationsTodayError, paidCountError, offenderError });
  }

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
  
  const topOffenders: TopOffender[] = offenderData || [];

  return { stats, chartData, topOffenders }
}

export default async function DashboardPage() {
  const { stats, chartData, topOffenders } = await getDashboardData();
  
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <DashboardCards stats={stats} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
           <TopOffenders offenders={topOffenders} />
        </div>
        <div className="lg:col-span-3">
            <ViolationsChart data={chartData} />
        </div>
      </div>
    </div>
  )
}
