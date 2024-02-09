import './globals.css'
import type { Metadata } from 'next'
import { Inter, VT323 } from 'next/font/google'

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Cursor Party',
  description: 'party by devesh',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={vt323.className}>{children}</body>
    </html>
  )
}