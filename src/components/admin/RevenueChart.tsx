'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { format, subDays, startOfDay } from 'date-fns'

export function RevenueChart() {
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ['revenue-chart-data'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString()
      
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, paid_at')
        .eq('status', 'success')
        .gte('paid_at', thirtyDaysAgo)
        .order('paid_at', { ascending: true })

      if (error) throw error

      // Group by day
      const grouped = payments.reduce((acc: any, payment) => {
        const day = format(new Date(payment.paid_at!), 'dd MMM')
        acc[day] = (acc[day] || 0) + payment.amount
        return acc
      }, {})

      return Object.entries(grouped).map(([name, total]) => ({ name, total }))
    }
  })

  if (isLoading) return <div className="h-full w-full bg-muted animate-pulse rounded-lg" />

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={11} 
          tickLine={false} 
          axisLine={false} 
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          stroke="#888888"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp${value / 1000}k`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Pendapatan']} 
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#6366f1"
          strokeWidth={3}
          dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
