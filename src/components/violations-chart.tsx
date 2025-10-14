'use client'

import * as React from 'react'
import { Pie, PieChart, Cell } from 'recharts'
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
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

interface ViolationsChartProps {
    data: ChartData;
}

const chartConfig = {
  paid: { label: 'Paid', color: 'hsl(var(--chart-1))' },
  unpaid: { label: 'Unpaid', color: 'hsl(var(--chart-2))' },
}

export function ViolationsChart({ data }: ViolationsChartProps) {
  const chartData = [
    { name: 'paid', value: data.paid, fill: 'var(--color-paid)' },
    { name: 'unpaid', value: data.unpaid, fill: 'var(--color-unpaid)' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challan Status</CardTitle>
        <CardDescription>Overview of paid and unpaid challans</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}