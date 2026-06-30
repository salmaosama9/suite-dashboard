import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Suite Analytics — App vs Web',
  description: 'Suite CRM: Mobile App vs Web usage metrics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
