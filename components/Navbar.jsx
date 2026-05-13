'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Kanban, Users, PlusCircle } from 'lucide-react'

const links = [
  { href: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/pipeline',   label: 'Pipeline',   icon: Kanban },
  { href: '/prospects',  label: 'Prospects',  icon: Users },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="font-bold text-brand-600 text-lg tracking-tight">Nathan CRM</span>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${active ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        <Link
          href="/prospects/nouveau"
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          <PlusCircle size={15} />
          <span className="hidden sm:inline">Nouveau</span>
        </Link>
      </div>
    </header>
  )
}
