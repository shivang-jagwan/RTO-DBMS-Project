'use client'

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { DashboardStats, Violation } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

export function ReportsClient() {
  const { toast } = useToast()
  const supabase = createClient()

  const generateReport = async (title: string, fromDate: Date) => {
    toast({ title: 'Generating Report...', description: 'Please wait a moment.' })
    
    // Fetch live data
    const { count: totalVehicles } = await supabase.from('vehicle').select('*', { count: 'exact', head: true });
    const { count: pendingChallans } = await supabase.from('violation').select('*', { count: 'exact', head: true }).eq('status', 'Unpaid');
    const { data: paidFines } = await supabase.from('violation').select('fine').eq('status', 'Paid');
    const { data: recentViolationsData } = await supabase.from('violation').select('*, driver(name)').gte('date', fromDate.toISOString());

    const totalFineCollected = paidFines ? paidFines.reduce((sum, item) => sum + item.fine, 0) : 0;
    
    const stats: DashboardStats = {
      totalVehicles: totalVehicles ?? 0,
      pendingChallans: pendingChallans ?? 0,
      totalFineCollected: totalFineCollected,
      violationsToday: 0, // Not calculated here for simplicity
    };

    const recentViolations: Violation[] = recentViolationsData?.map((v: any) => ({
      id: v.id,
      vehicle_reg_no: v.vehicle_reg_no,
      driver_name: v.driver.name,
      violation_type: v.violation_type,
      fine: v.fine,
      status: v.status,
      date: v.date,
    })) || [];
    
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
