import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const site = 'https://mariz.ai'

export const metadata: Metadata = {
  title: 'VibeFlow — Less brainrot, more flow',
  description:
    'Block distracting apps on iPhone. Unlock when you code with Cursor or Claude — automatically. Focus mode for developers.',
  keywords: [
    'VibeFlow',
    'focus app',
    'iPhone',
    'block apps',
    'Cursor',
    'Claude Code',
    'developer productivity',
    'screen time',
    'focus mode',
    'coding',
  ],
  robots: { index: true, follow: true },
  authors: [{ name: 'VibeFlow' }],
  openGraph: {
    type: 'website',
    title: 'VibeFlow — Less brainrot, more flow',
    description:
      'Block distracting apps on iPhone. Unlock when you code with Cursor or Claude — automatically.',
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    siteName: 'VibeFlow',
    url: `${site}/vibeflow`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeFlow — Less brainrot, more flow',
    description:
      'Block distracting apps on iPhone. Unlock when you code with Cursor or Claude — automatically.',
  },
  alternates: {
    canonical: `${site}/vibeflow`,
    languages: {
      en: `${site}/vibeflow`,
      'pt-BR': `${site}/vibeflow`,
      'x-default': `${site}/vibeflow`,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0c0d0f',
}

export default function VibeflowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${outfit.variable} ${jetbrainsMono.variable}`}>{children}</div>
  )
}
