import { fetchDashboardData } from '@/lib/mixpanel'
import Dashboard from '@/components/Dashboard'

// Revalidate every 5 minutes
export const revalidate = 300

export default async function Page() {
  const data = await fetchDashboardData()
  return <Dashboard data={data} />
}
