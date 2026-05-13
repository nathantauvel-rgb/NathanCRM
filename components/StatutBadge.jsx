const CONFIG = {
  a_contacter:  { label: 'À contacter',         color: 'bg-gray-100 text-gray-700' },
  contacte:     { label: 'Contacté',             color: 'bg-blue-100 text-blue-700' },
  en_discussion:{ label: 'En discussion',        color: 'bg-yellow-100 text-yellow-700' },
  proposition:  { label: 'Proposition envoyée',  color: 'bg-purple-100 text-purple-700' },
  client:       { label: 'Client',               color: 'bg-green-100 text-green-700' },
  perdu:        { label: 'Perdu',                color: 'bg-red-100 text-red-700' },
}

export const STATUTS = Object.entries(CONFIG).map(([value, { label }]) => ({ value, label }))

export default function StatutBadge({ statut }) {
  const { label, color } = CONFIG[statut] ?? CONFIG.a_contacter
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
