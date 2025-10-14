import { createClient } from '@/lib/supabase/server'
import { VehiclesTableClient } from '@/components/vehicles-table-client'
import type { Vehicle } from '@/lib/types'

async function getVehicles(): Promise<Vehicle[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('vehicle').select(`
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
  `);

  if (error) {
    console.error('Error fetching vehicles:', error.message)
    return []
  }
  
  return data as Vehicle[];
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
      </div>
      <VehiclesTableClient initialVehicles={vehicles} />
    </div>
  )
}
