'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUTS } from './StatutBadge'

const SECTEURS = ['Artisan', 'Plombier', 'Électricien', 'Menuisier', 'Peintre', 'Maçon', 'Carreleur', 'Couvreur', 'Autre']

export default function ProspectForm({ prospect }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nom: prospect?.nom ?? '',
    entreprise: prospect?.entreprise ?? '',
    secteur: prospect?.secteur ?? 'Artisan',
    telephone: prospect?.telephone ?? '',
    email: prospect?.email ?? '',
    ville: prospect?.ville ?? '',
    statut: prospect?.statut ?? 'a_contacter',
    prochaine_relance: prospect?.prochaine_relance ?? '',
    notes: prospect?.notes ?? '',
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = { ...form, prochaine_relance: form.prochaine_relance || null }
    const url = prospect ? `/api/prospects/${prospect.id}` : '/api/prospects'
    const method = prospect ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erreur inattendue')
      setLoading(false)
      return
    }

    router.push('/prospects')
    router.refresh()
  }

  const field = 'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Nom *</label>
          <input required className={field} value={form.nom} onChange={set('nom')} />
        </div>
        <div>
          <label className={label}>Entreprise *</label>
          <input required className={field} value={form.entreprise} onChange={set('entreprise')} />
        </div>
        <div>
          <label className={label}>Secteur</label>
          <select className={field} value={form.secteur} onChange={set('secteur')}>
            {SECTEURS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Ville</label>
          <input className={field} value={form.ville} onChange={set('ville')} placeholder="Paris" />
        </div>
        <div>
          <label className={label}>Téléphone</label>
          <input className={field} value={form.telephone} onChange={set('telephone')} placeholder="06 00 00 00 00" />
        </div>
        <div>
          <label className={label}>Email</label>
          <input type="email" className={field} value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className={label}>Statut</label>
          <select className={field} value={form.statut} onChange={set('statut')}>
            {STATUTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Prochaine relance</label>
          <input type="date" className={field} value={form.prochaine_relance} onChange={set('prochaine_relance')} />
        </div>
      </div>

      <div>
        <label className={label}>Notes</label>
        <textarea rows={3} className={field} value={form.notes} onChange={set('notes')} />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-md"
        >
          {loading ? 'Enregistrement...' : prospect ? 'Mettre à jour' : 'Créer le prospect'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
