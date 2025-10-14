import { createClient } from '@/lib/supabase/server'
import { ViolationsTableClient } from '@/components/violations-table-client'
import type { Violation } from '@/lib/types'

async function getViolations(): Promise<Violation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('violation')
    .select(
      `
      id,
      violation_type,
      fine,
      status,
      date,
      vehicle (
        regno,
        driver (
          name
        )
      )
    `
    )
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching violations:', error.message)
    return []
  }

  return data.map((v: any) => ({
    id: v.id,
    violation_type: v.violation_type,
    fine: v.fine,
    status: v.status,
    date: v.date,
    vehicle_reg_no: v.vehicle.regno,
    driver_name: v.vehicle.driver.name,
  })) as Violation[]
}

export default async function ViolationsPage() {
  const violations = await getViolations()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Violations</h1>
      </div>
      <ViolationsTableClient initialViolations={violations} />
    </div>
  )
}
