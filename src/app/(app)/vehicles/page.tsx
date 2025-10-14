import { createClient } from '@/lib/supabase/server'
import { MOCK_VEHICLES } from '@/lib/mock-data'
import { VehiclesTableClient } from '@/components/vehicles-table-client'
import type { Vehicle } from '@/lib/types'

async function getVehicles(): Promise<Vehicle[]> {
  // In a real application, fetch from Supabase.
  // For now, we use mock data.
  return MOCK_VEHICLES;
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
      </div>
      <VehiclesTableClient vehicles={vehicles} />
    </div>
  )
}
