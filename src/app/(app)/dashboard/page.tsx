import { createClient } from '@/lib/supabase/server'
import { DashboardCards } from '@/components/dashboard-cards'
import { ViolationsChart } from '@/components/violations-chart'
import { TopOffenders } from '@/components/top-offenders'
import type { DashboardStats, ChartData, TopOffender } from '@/lib/types'

async function getDashboardData(): Promise<{
  stats: DashboardStats,
  chartData: ChartData,
  topOffenders: TopOffender[]
}> {
  const supabase = createClient()

  try {
    // Fetch all vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicle')
      .select('*')
    if (vehiclesError) throw vehiclesError

    // Fetch all violations along with driver info via vehicle
    const { data: violations, error: violationsError } = await supabase
      .from('violation')
      .select(`
        violationid,
        vehicleid,
        violationtype,
        fineamount,
        paymentstatus,
        occurdate,
        vehicle:vehicleid(
          regno,
          ownerdriverid,
          driver:ownerdriverid(
            name,
            contact
          )
        )
      `)
    if (violationsError) throw violationsError

    // Calculate stats
    const pendingChallans = violations.filter(v => v.paymentstatus === 'Unpaid').length
    const paidChallans = violations.filter(v => v.paymentstatus === 'Paid')
    const totalFineCollected = paidChallans.reduce((sum, v) => sum + Number(v.fineamount), 0)
    const today = new Date()
    const violationsToday = violations.filter(v => v.occurdate && new Date(v.occurdate).toDateString() === today.toDateString()).length

    const stats: DashboardStats = {
      totalVehicles: vehicles.length,
      pendingChallans,
      totalFineCollected,
      violationsToday
    }

    // Chart Data
    const chartData: ChartData = {
      paid: paidChallans.length,
      unpaid: pendingChallans
    }

    // Top Offenders
    const offenderCounts = violations.reduce((acc: { [key: string]: TopOffender }, v: any) => {
      if (!v.vehicle?.driver) return acc
      const driverId = v.vehicle.driverid
      if (!acc[driverId]) {
        acc[driverId] = {
          driverid: driverId,
          name: v.vehicle.driver.name,
          contact: v.vehicle.driver.contact,
          violation_count: 0
        }
      }
      acc[driverId].violation_count++
      return acc
    }, {})

    const topOffenders = Object.values(offenderCounts)
      .sort((a, b) => b.violation_count - a.violation_count)
      .slice(0, 5)

    return { stats, chartData, topOffenders }

  } catch (err) {
    console.error('Dashboard fetch error:', err)
    return {
      stats: {
        totalVehicles: 0,
        pendingChallans: 0,
        totalFineCollected: 0,
        violationsToday: 0
      },
      chartData: {
        paid: 0,
        unpaid: 0
      },
      topOffenders: []
    }
  }
}

export default async function DashboardPage() {
  const { stats, chartData, topOffenders } = await getDashboardData()

  if (!stats) {
    return <div className="text-center text-red-500">Error loading dashboard data. Please try again later.</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Dashboard Cards */}
      <DashboardCards stats={stats} />

      {/* Charts & Top Offenders */}
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
