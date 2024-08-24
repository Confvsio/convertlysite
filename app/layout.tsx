import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formulaire d\'inscription pour Lvl\'Up',
  description: 'Inscrivez-vous pour rejoindre la communauté Lvl\'Up',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}