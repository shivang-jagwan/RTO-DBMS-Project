import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { TopOffender } from '@/lib/types'

interface TopOffendersProps {
  offenders: TopOffender[]
}

export function TopOffenders({ offenders }: TopOffendersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Repeat Offenders</CardTitle>
        <CardDescription>
          Drivers with the highest number of violations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Violation Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offenders.map((offender) => (
              <TableRow key={offender.driverid}>
                <TableCell>{offender.name}</TableCell>
                <TableCell>{offender.contact}</TableCell>
                <TableCell className="text-right">{offender.violation_count}</TableCell>
              </TableRow>
            ))}
            {offenders.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center">No offender data available.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
