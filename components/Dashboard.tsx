'use client'

import type { DashboardData } from '@/lib/mixpanel'
import BarChartCard from './BarChartCard'
import RetentionChart from './RetentionChart'
import FunnelChart from './FunnelChart'

const APP_COLOR = '#3B82F6'
const WEB_COLOR = '#10B981'

export default function Dashboard({ data }: { data: DashboardData }) {
  return (
    <div className="min-h-screen bg-slate-900 p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Suite Analytics</h1>
        <p className="text-slate-400 text-sm">Mobile App vs Web CRM — last 30 days</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-slate-900 rounded-lg p-3 text-center"><div className="text-2xl font-bold" style={{ color: APP_COLOR }}>{data.appReach.total.toLocaleString()}</div><div className="text-xs text-slate-500 mt-0.5">App Users</div></div>
        <div className="bg-slate-900 rounded-lg p-3 text-center"><div className="text-2xl font-bold" style={{ color: WEB_COLOR }}>{data.webReach.total.toLocaleString()}</div><div className="text-xs text-slate-500 mt-0.5">Web Users</div></div>
      </div>
      {[1,2,3,4,5,6,7,0].map((_,i) => <section key={i} className="mb-8" />)}
      <footer className="text-center text-xs text-slate-600 mt-4 pb-6">Data refreshes every 5 minutes · Powered by Mixpanel</footer>
    </div>
  )
}
