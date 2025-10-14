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
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { sendNotification, ViolationNotificationInput } from '@/ai/flows/send-notification-flow'

interface ViolationsTableClientProps {
  initialViolations: Violation[]
}

export function ViolationsTableClient({ initialViolations }: ViolationsTableClientProps) {
  const [violations, setViolations] = useState(initialViolations)
  const [sendingNotificationId, setSendingNotificationId] = useState<string | null>(null);
  const { toast } = useToast()
  const supabase = createClient()

  const handleMarkAsPaid = async (violationId: string) => {
    const { data, error } = await supabase
      .from('violation')
      .update({ paymentstatus: 'Paid' })
      .eq('violationid', violationId)
      .select()

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to mark as paid.' })
    } else {
      setViolations(violations.map(v => v.violationid === violationId ? { ...v, paymentstatus: 'Paid' } : v))
      toast({ title: 'Success', description: 'Violation marked as paid.' })
    }
  }

  const handleSendNotification = async (violation: Violation) => {
    if (!violation.vehicle) {
      toast({ variant: 'destructive', title: 'Error', description: 'Vehicle information is missing.' })
      return;
    }
    
    setSendingNotificationId(violation.violationid);

    const notificationData: ViolationNotificationInput = {
      violationid: violation.violationid,
      regno: violation.vehicle.regno,
      violationtype: violation.violationtype,
      fineamount: violation.fineamount,
      occurdate: violation.occurdate,
    };

    try {
      const result = await sendNotification(notificationData);
      if (result.success) {
        toast({ title: 'Notification Sent', description: "Notification sent to your number (prototype)." });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error(`Sending notification for violation ${violation.violationid} failed:`, error);
      toast({ 
        variant: 'destructive', 
        title: 'Notification Failed', 
        description: error.message || `Could not send notification for violation ID: ${violation.violationid}` 
      });
    } finally {
      setSendingNotificationId(null);
    }
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
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.map((violation) => (
            <TableRow key={violation.violationid}>
              <TableCell className="font-mono text-xs">{violation.violationid}</TableCell>
              <TableCell className="font-medium">{violation.vehicle?.regno ?? 'N/A'}</TableCell>
              <TableCell>{violation.vehicle?.driver?.name ?? 'N/A'}</TableCell>
              <TableCell>{violation.violationtype}</TableCell>
              <TableCell>₹{violation.fineamount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={violation.paymentstatus === 'Paid' ? 'secondary' : 'destructive'}>{violation.paymentstatus}</Badge>
              </TableCell>
              <TableCell>
                {violation.occurdate ? format(new Date(violation.occurdate), 'PPp') : 'Never'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  {violation.paymentstatus === 'Unpaid' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(violation.violationid)}>Mark as Paid</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSendNotification(violation)}
                        disabled={sendingNotificationId === violation.violationid}
                      >
                        {sendingNotificationId === violation.violationid ? 'Sending...' : 'Send Notification'}
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
