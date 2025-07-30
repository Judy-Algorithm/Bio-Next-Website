import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bio-Next',
  description: 'Bio-Next 是一个将你的想法变为行动的通用 AI 助手。它在工作和生活中擅长各种任务，让你休息的同时完成一切工作。',
  keywords: ['AI', '助手', '自动化', '生产力'],
  authors: [{ name: 'Bio-Next Team' }],
  creator: 'Bio-Next',
  publisher: 'Bio-Next',
  robots: 'index, follow',
  openGraph: {
    title: 'Bio-Next',
    description: 'Bio-Next 是一个将你的想法变为行动的通用 AI 助手。它在工作和生活中擅长各种任务，让你休息的同时完成一切工作。',
    url: 'https://bio-next.com',
    siteName: 'Bio-Next',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bio-Next',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bio-Next',
    description: 'Bio-Next 是一个将你的想法变为行动的通用 AI 助手。它在工作和生活中擅长各种任务，让你休息的同时完成一切工作。',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/Pig_Robot.png',
    shortcut: '/Pig_Robot.png',
    apple: '/Pig_Robot.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" dir="ltr" className="bg-[var(--background-white-main)] light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#f8f8f7" />
        <link rel="canonical" href="https://bio-next.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              globalThis.__bio_next_env__ = {
                env: "dev",
                serverUrl: "http://localhost:3001",
                wsUrl: "ws://localhost:3001",
                prod: false,
                googleDriveAppId: "your-google-drive-app-id",
                googleMapApiKey: "your-google-map-api-key",
                amplitudeKey: "your-amplitude-key"
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex w-full h-full overflow-hidden">
          <div className="h-full bg-[var(--background-gray-main)] w-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
} 