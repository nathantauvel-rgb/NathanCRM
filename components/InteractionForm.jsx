'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Phone, Mail, Calendar } from 'lucide-react'

const TYPES = [
  { value: 'note',     label: 'Note',     Icon: MessageSquare },
  { value: 'appel',    label: 'Appel',    Icon: Phone },
  { value: 'email',    label: 'Email',    Icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', Icon: MessageSquare },
  { value: 'rdv',      label: 'RDV',      Icon: Calendar },
]

export default function InteractionForm({ prospectId }) {
  const router = useRouter()
  const [contenu, setContenu] = useState('')
  const [type, setType] = useState('note')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!contenu.trim()) return
    setLoading(true)

    await fetch(`/api/prospects/${prospectId}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenu, type }),
    })

    setContenu('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
              ${type === value ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-300 text-gray-600 hover:border-brand-400'}`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          rows={2}
          required
          value={contenu}
          onChange={e => setContenu(e.target.value)}
          placeholder="Ajouter une note ou un compte-rendu..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="self-end bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md"
        >
          Ajouter
        </button>
      </div>
    </form>
  )
}
