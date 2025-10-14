'use client'

import * as React from 'react'
import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { ChartData } from '@/lib/types'
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface ViolationsChartProps {
    data: ChartData;
}

export function ViolationsChart({ data }: ViolationsChartProps) {
  const chartData = [
    { name: 'Paid', value: data.paid, fill: 'hsl(var(--chart-1))' },
    { name: 'Unpaid', value: data.unpaid, fill: 'hsl(var(--chart-2))' },
  ]

  const chartConfig = {
    paid: { label: 'Paid', color: 'hsl(var(--chart-1))' },
    unpaid: { label: 'Unpaid', color: 'hsl(var(--chart-2))' },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challan Status</CardTitle>
        <CardDescription>Overview of paid and unpaid challans</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
