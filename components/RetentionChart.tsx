'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { RetentionRow } from '@/lib/mixpanel'
interface Props { appRetention: RetentionRow[]; webRetention: RetentionRow[] }
export default function RetentionChart({ appRetention, webRetention }: Props) {
  const toWeekSeries = (rows: RetentionRow[]) => {
    if (!rows.length) return []
    const maxWeeks = Math.max(...rows.map(r => r.rates.length))
    return Array.from({ length: maxWeeks }, (_, wi) => {
      const vals = rows.map(r => r.rates[wi]).filter(v => v !== undefined)
      return { week: `W${wi + 1}`, value: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null }
    })
  }
  const appSeries = toWeekSeries(appRetention), webSeries = toWeekSeries(webRetention)
  const weeks = Math.max(appSeries.length, webSeries.length)
  const data = Array.from({ length: weeks }, (_, i) => ({ week: `W${i+1}`, app: appSeries[i]?.value ?? null, web: webSeries[i]?.value ?? null }))
  if (!data.some(d => d.app !== null || d.web !== null)) return <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No retention data available</div>
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
        <Tooltip formatter={(v: number, n: string) => [`${v}%`, n === 'app' ? 'App' : 'Web CRM']} contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 6 }} labelStyle={{ color: '#E2E8F0' }} />
        <Legend formatter={v => v === 'app' ? 'App' : 'Web CRM'} wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
        <Line type="monotone" dataKey="app" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} connectNulls />
        <Line type="monotone" dataKey="web" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} strokeDasharray="4 2" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}
