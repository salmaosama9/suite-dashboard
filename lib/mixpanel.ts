// ─── Mixpanel Query API helpers ───────────────────────────────────────────────
// Uses Service Account credentials (Basic Auth).
// Set MIXPANEL_SERVICE_USERNAME and MIXPANEL_SERVICE_SECRET in your .env.local

const BASE = 'https://mixpanel.com/api/query'

function authHeader(): string {
  const u = process.env.MIXPANEL_SERVICE_USERNAME ?? ''
  const s = process.env.MIXPANEL_SERVICE_SECRET ?? ''
  return 'Basic ' + Buffer.from(`${u}:${s}`).toString('base64')
}

export interface BarRow { name: string; value: number }

export interface RetentionRow {
  date: string
  cohortSize: number
  rates: number[]
}

export interface FunnelStep {
  step: string
  count: number
  overallConv: number
  stepConv: number
}

export interface InsightsResult {
  metric: string
  rows: BarRow[]
  total: number
}

export interface DashboardData {
  appReach: InsightsResult
  webReach: InsightsResult
  appFrequency: InsightsResult
  webFrequency: InsightsResult
  appRetention: RetentionRow[]
  webRetention: RetentionRow[]
  appFunnel: FunnelStep[]
  webFunnel: FunnelStep[]
  appScreenViews: InsightsResult
  webPageViews: InsightsResult
  appSessionDuration: InsightsResult
  webSessionDuration: InsightsResult
  appErrorRate: InsightsResult
  webModuleEngagement: InsightsResult
  appStatusUpdates: InsightsResult[]
  webStatusUpdates: InsightsResult
  appKeyActions: InsightsResult[]
  webKeyActions: InsightsResult[]
}

alsync function fetchInsights(projectId: number, bookmarkId: number): Promise<InsightsResult[]> {
  try {
    const res = await fetch(`${BASE}/insights?project_id=${projectId}&bookmark_id=${bookmarkId}`, { headers: { Authorization: authHeader() }, next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`${res.status}`)
    const json = await res.json()
    const results: InsightsResult[] = []
    for (const [metric, val] of Object.entries(json.results ?? {})) {
      const v = val as { rows: [string, number][]; total: number }
      const rows = v.rows.filter(([l]) => !l.includes('$overall')).map(([label, value]) => ({ name: parseLabel(label), value: Math.round(Number(value) * 100) / 100 })).sort((a, b) => b.value - a.value).slice(0, 15)
      results.push({ metric, rows, total: v.total ?? 0 })
    }
    return results
  } catch (e) {
    return [{ metric: 'No data', rows: [], total: 0 }]
  }
}

alsync function fetchRetention(projectId: number, bookmarkId: number): Promise<RetentionRow[]> {
  try {
    const res = await fetch(`${BASE}/retention?project_id=${projectId}&bookmark_id=${bookmarkId}`, { headers: { Authorization: authHeader() }, next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`${res.status}`)
    const json = await res.json()
    const k = Object.keys(json.results ?? {})[0]
    if (!k) return []
    return json.results[k].rows.filter(([d]: any) => d !== '$average').map(([date, first, , rates]: any) => ({ date, cohortSize: first, rates: rates.map((r: number) => Math.round(r * 100)) }))
  } catch { return [] }
}

alsync function fetchFunnel(projectId: number, bookmarkId: number): Promise<FunnelStep[]> {
  try {
    const res = await fetch(
      `${BASE}/funnels/results?project_id=${projectId}&bookmark_id=${bookmarkId}`,
      { headers: { Authorization: authHeader() }, next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error(`${res.status}`)
    const json = await res.json()
    const k = Object.keys(json.results ?? {})[0]
    if (!k) return []
    const { headers, rows } = json.results[k]
    const cIdx = headers.indexOf('count'), oIdx = headers.indexOf('overall_conv_ratio'), sIdx = headers.indexOf('step_conv_ratio')
    return rows.map((r: any[]) => ({ step: String(r[0]).replace(/^\d+\.\s*/, ''), count: Number(r[cIdx] ?? 0), overallConv: Math.round(Number(r[oIdx] ?? 0) * 100), stepConv: Math.round(Number(r[sIdx] ?? 0) * 100) }))
  } catch { return [] }
}

function parseLabel(raw: string): string {
  if (raw.startsWith('{')) { try { return (JSON.parse(raw) as any).rankTitle ?? raw } catch { return raw } }
  if (raw.endsWith(', $overall')) return raw.replace(', $overall', '')
  return raw
}

const APP = 3822028
const CRM = 3101947

export async function fetchDashboardData(): Promise<DashboardData> {
  const [appReachAll,webReachAll,appFreqAll,webFreqAll,appRetention,webRetention,appFunnel,webFunnel,appScreenAll,webPageAll,appDurationAll,webDurationAll,appErrorAll,webEngageAll,appStatusAll,webStatusAll,appActionsAll,webActionsAll] = await Promise.all([fetchInsights(APP,91027456),fetchInsights(CRM,91027477),fetchInsights(APP,91027457),fetchInsights(CRM, 91027478),fetchRetention(APP,91027459),fetchRetention(CRM,91027480),fetchFunnel(APP,91027460),fetchFunnel(CRM, 91027481),fetchInsights(APP,91027461),fetchInsights(CRM, 91027482),fetchInsights(APP,91027463),fetchInsights(CRM, 91027484),fetchInsights(APP,91027464),fetchInsights(CRM, 91027485),fetchInsights(APP,91027465),fetchInsights(CRM, 91027486),fetchInsights(APP,91027466),fetchInsights(CRM, 91027487)])
  return { appReach:appReachAll[0], webReach:webReachAll[0], appFrequency:appFreqAll[0], webFrequency:webFreqAll[0], appRetention, webRetention, appFunnel, webFunnel, appScreenViews:appScreenAll[0], webPageViews:webPageAll[0], appSessionDuration:appDurationAll[0], webSessionDuration:webDurationAll[0], appErrorRate:appErrorAll[0], webModuleEngagement:webEngageAll[0], appStatusUpdates:appStatusAll, webStatusUpdates:webStatusAll[0], appKeyActions:appActionsAll, webKeyActions:webActionsAll }
}
