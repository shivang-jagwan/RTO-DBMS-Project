'use client'

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { DashboardStats, Violation } from '@/lib/types'
import { MOCK_DASHBOARD_STATS, MOCK_VIOLATIONS } from '@/lib/mock-data'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export function ReportsClient() {
  const { isDemoMode } = useAuth()
  const { toast } = useToast()

  const generateReport = (title: string, fromDate: Date) => {
    toast({ title: 'Generating Report...', description: 'Please wait a moment.' })
    
    // In a real app, fetch this data based on the date range
    const stats: DashboardStats = MOCK_DASHBOARD_STATS
    const recentViolations: Violation[] = MOCK_VIOLATIONS.filter(v => new Date(v.date) >= fromDate)
    
    const doc = new jsPDF()
    const today = new Date();

    // Title
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, 29)

    // Summary Section
    const summaryText = `
Total Vehicles: ${stats.totalVehicles}
Pending Challans: ${stats.pendingChallans}
Total Fine Collected: Rs. ${stats.totalFineCollected.toLocaleString()}
Violations since ${fromDate.toLocaleDateString()}: ${recentViolations.length}
    `;
    doc.setFontSize(12);
    doc.text(summaryText, 14, 45);

    // Table of Recent Violations
    autoTable(doc, {
      startY: 80,
      head: [['Violation ID', 'Vehicle No', 'Type', 'Fine', 'Status']],
      body: recentViolations.map(v => [v.id, v.vehicle_reg_no, v.violation_type, `Rs. ${v.fine}`, v.status]),
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] }, // #1E3A8A
    })
    
    const fileName = `${title.toLowerCase().replace(/ /g, '_')}_${today.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName)

    toast({ title: 'Report Downloaded', description: `${fileName} has been saved.` })
  }

  const handleDownloadDaily = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    generateReport('Daily Report', yesterday)
  }

  const handleDownloadMonthly = () => {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    generateReport('Monthly Report', lastMonth)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button onClick={handleDownloadDaily}>
        <Download className="mr-2 h-4 w-4" />
        Download Daily Report (PDF)
      </Button>
      <Button onClick={handleDownloadMonthly}>
        <Download className="mr-2 h-4 w-4" />
        Download Monthly Report (PDF)
      </Button>
    </div>
  )
}
