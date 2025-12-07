import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/widgets/Header/Header'
import { AuthInitializer } from './components/AuthInitializer'

export const metadata: Metadata = {
  title: 'Service Booking Platform - Book & Offer Services',
  description: 'Universal platform for booking services and offering your own services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthInitializer />
        <Header />
        {children}
      </body>
    </html>
  )
}

