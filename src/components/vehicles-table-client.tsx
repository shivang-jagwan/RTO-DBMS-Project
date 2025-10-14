'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { Vehicle, Violation } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from './ui/skeleton'

interface VehiclesTableClientProps {
  initialVehicles: Vehicle[]
}

export function VehiclesTableClient({ initialVehicles }: VehiclesTableClientProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [vehicleViolations, setVehicleViolations] = useState<Violation[]>([])
  const [loadingViolations, setLoadingViolations] = useState(false)
  const supabase = createClient()

  const handleViewDetails = async (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setLoadingViolations(true)

    try {
      const { data, error } = await supabase
        .from('violation')
        .select(`
          violationid,
          violationtype,
          fineamount,
          paymentstatus,
          occurdate,
          vehicle:vehicleid (
            regno,
            ownerdriverid,
            driver:ownerdriverid (
              name,
              contact
            )
          )
        `)
        .eq('vehicleid', vehicle.vehicleid)

      if (error) throw error

      const violationsData = data.map((v: any) => ({
        id: v.violationid,
        vehicle_reg_no: v.vehicle.regno,
        driver_name: v.vehicle.driver?.name || 'Unknown',
        violation_type: v.violationtype,
        fine: v.fineamount,
        status: v.paymentstatus,
        date: v.occurdate,
      })) as Violation[]

      setVehicleViolations(violationsData)
    } catch (err) {
      console.error('Error fetching vehicle violations:', err)
      setVehicleViolations([])
    }

    setLoadingViolations(false)
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Reg No</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={`vehicle-${vehicle.vehicleid}`}>
                <TableCell className="font-medium">{vehicle.regno}</TableCell>
                <TableCell>{vehicle.driver?.name || 'Unknown'}</TableCell>
                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(vehicle)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Violation History: {selectedVehicle?.regno}</DialogTitle>
                        <DialogDescription>
                          All recorded violations for this vehicle.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {loadingViolations ? (
                          <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Violation</TableHead>
                                <TableHead>Fine</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {vehicleViolations.length > 0 ? (
                                vehicleViolations.map((v) => (
                                  <TableRow key={`violation-${v.id}`}>
                                    <TableCell>{v.violation_type}</TableCell>
                                    <TableCell>₹{v.fine}</TableCell>
                                    <TableCell>{new Date(v.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <Badge variant={v.status === 'Paid' ? 'secondary' : 'destructive'}>
                                        {v.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center">
                                    No violations found.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
