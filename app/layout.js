import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Nathan CRM',
  description: 'Gestion de prospection commerciale',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
