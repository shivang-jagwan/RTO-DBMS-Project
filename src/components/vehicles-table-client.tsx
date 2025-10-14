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
import { MOCK_VIOLATIONS } from '@/lib/mock-data'
import { useAuth } from '@/hooks/use-auth'

interface VehiclesTableClientProps {
  vehicles: Vehicle[]
}

export function VehiclesTableClient({ vehicles }: VehiclesTableClientProps) {
  const { isDemoMode } = useAuth()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [vehicleViolations, setVehicleViolations] = useState<Violation[]>([])

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    if (isDemoMode) {
      setVehicleViolations(MOCK_VIOLATIONS.filter(v => v.vehicle_reg_no === vehicle.reg_no))
    } else {
      // In a real app, fetch violations for the vehicle
      // For now, we'll use mock data as a fallback
      setVehicleViolations(MOCK_VIOLATIONS.filter(v => v.vehicle_reg_no === vehicle.reg_no))
    }
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.reg_no}</TableCell>
                <TableCell>{vehicle.owner_name}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>
                  <Badge variant={vehicle.status === 'Active' ? 'default' : 'secondary'}>{vehicle.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(vehicle)}>View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Violation History: {selectedVehicle?.reg_no}</DialogTitle>
                        <DialogDescription>
                          All recorded violations for this vehicle.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto">
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
                              vehicleViolations.map(v => (
                                <TableRow key={v.id}>
                                  <TableCell>{v.violation_type}</TableCell>
                                  <TableCell>₹{v.fine}</TableCell>
                                  <TableCell>{new Date(v.date).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Badge variant={v.status === 'Paid' ? 'secondary' : 'destructive'}>{v.status}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center">No violations found.</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
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
