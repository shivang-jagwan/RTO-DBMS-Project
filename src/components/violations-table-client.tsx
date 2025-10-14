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
import { Badge } from '@/components/ui/badge'
import type { Violation } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

interface ViolationsTableClientProps {
  initialViolations: Violation[]
}

export function ViolationsTableClient({ initialViolations }: ViolationsTableClientProps) {
  const [violations, setViolations] = useState(initialViolations)
  const { toast } = useToast()
  const { isDemoMode } = useAuth()

  const handleMarkAsPaid = async (violationId: string) => {
    if (isDemoMode) {
      setViolations(violations.map(v => v.id === violationId ? { ...v, status: 'Paid' } : v))
      toast({ title: 'Success', description: 'Violation marked as paid in demo mode.' })
      return
    }
    // In a real app, you would call a server action to update the database
    // const error = await markViolationAsPaid(violationId);
    // if (error) { ... }
    toast({ title: 'Success', description: 'Violation marked as paid.' })
  }

  const handleSendNotification = (violationId: string) => {
    toast({ title: 'Notification Sent', description: `Notification sent for violation ID: ${violationId}` })
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Violation ID</TableHead>
            <TableHead>Vehicle No</TableHead>
            <TableHead>Driver Name</TableHead>
            <TableHead>Violation Type</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.map((violation) => (
            <TableRow key={violation.id}>
              <TableCell className="font-mono text-xs">{violation.id}</TableCell>
              <TableCell className="font-medium">{violation.vehicle_reg_no}</TableCell>
              <TableCell>{violation.driver_name}</TableCell>
              <TableCell>{violation.violation_type}</TableCell>
              <TableCell>₹{violation.fine.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={violation.status === 'Paid' ? 'secondary' : 'destructive'}>{violation.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  {violation.status === 'Unpaid' && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(violation.id)}>Mark as Paid</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleSendNotification(violation.id)}>Send Notification</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
