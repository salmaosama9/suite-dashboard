'use client'
import type { FunnelStep } from '@/lib/mixpanel'
interface Props { appFunnel: FunnelStep[]; webFunnel: FunnelStep[] }
function SingleFunnel({ steps, color, label }: { steps: FunnelStep[]; color: string; label: string }) {
  if (!steps.length) return <div className="text-slate-500 text-sm text-center py-8">No funnel data</div>
  const maxCount = steps[0].count || 1
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium mb-3" style={{ color }}>{label}</div>
      {steps.map((step, i) => {
        const width = Math.max((step.count / maxCount) * 100, 2)
        return (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-300 truncate max-w[70%]">{step.step}</span>
              <span className="text-xs text-slate-400 ml-2">{step.count.toLocaleString()}{i > 0 && <span style={{ color }}> ({step.overallConv}%)</span>}</span>
            </div>
            <div className="h-5 rounded overflow-hidden bg-slate-800"><div className="h-full rounded" style={{ width: `width}%`, backgroundColor: color, opacity: 1 - i * 0.15 }} /></div>
          </div>
        )
      })}
    </div>
  )
}
export default function FunnelChart({ appFunnel, webFunnel }: Props) {
  return (<div className="grid grid-cols-2 gap-6"><SingleFunnel steps={appFunnel} color="#3B82F6" label="App Funnel" /><SingleFunnel steps={webFunnel} color="#10B981" label="Web CRM Funnel" /></div>)
}
