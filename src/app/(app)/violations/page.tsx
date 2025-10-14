import { createClient } from '@/lib/supabase/server'
import { MOCK_VIOLATIONS } from '@/lib/mock-data'
import { ViolationsTableClient } from '@/components/violations-table-client'
import type { Violation } from '@/lib/types'

async function getViolations(): Promise<Violation[]> {
  // In a real application, fetch from Supabase.
  // For now, we use mock data.
  return MOCK_VIOLATIONS;
}

export default async function ViolationsPage() {
  const violations = await getViolations();
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Violations</h1>
      </div>
      <ViolationsTableClient initialViolations={violations} />
    </div>
  )
}
