import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import './globals.css'

const vazirmatn = Vazirmatn({
  subsets: ['latin', 'arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-vazirmatn',
})

export const metadata: Metadata = {
  title: 'داشبورد رصد و پایش نیروی داوطلبی و خدمات ارائه شده توسط جمعیت هلال احمر',
  description: 'داشبورد رصد و پایش نیروی داوطلبی و خدمات ارائه شده توسط جمعیت هلال احمر',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="ltr" className={vazirmatn.variable}>
      <body className={vazirmatn.className}>{children}</body>
    </html>
  )
}

