'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { InsightsResult } from '@/lib/mixpanel'

interface Props { data: InsightsResult; color: string; unit?: string; maxRows?: number }

export default function BarChartCard({ data, color, unit = '', maxRows = 12 }: Props) {
  const rows = data.rows.slice(0, maxRows)
  if (!rows.length) return <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No data available</div>
  return (
    <div>
      <div className="text-xs text-slate-400 mb-1 truncate">{data.metric}</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={rows} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fill: '#CBD5E1