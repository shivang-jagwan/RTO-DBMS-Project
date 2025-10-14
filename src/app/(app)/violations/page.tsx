import { createClient } from '@/lib/supabase/server'
import { ViolationsTableClient } from '@/components/violations-table-client'
import type { Violation } from '@/lib/types'

async function getViolations(): Promise<Violation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('violation')
    .select(
      `
      violationid,
      violationtype,
      fineamount,
      paymentstatus,
      occurdate,
      vehicle:vehicleid (
        vehicleid,
        regno,
        make,
        model,
        color,
        driver:ownerdriverid (
          driverid,
          name,
          contact,
          phonenumber,
          address
        )
      )
    `
    )
    .order('occurdate', { ascending: false })

  if (error) {
    console.error('Error fetching violations:', error)
    return []
  }

  return data as Violation[]
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
