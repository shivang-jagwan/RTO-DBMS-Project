import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportsClient } from '@/components/reports-client'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Download summary reports of traffic enforcement activities in PDF format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsClient />
        </CardContent>
      </Card>
    </div>
  )
}
