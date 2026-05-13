import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { PlusCircle, Phone, Mail, Download } from 'lucide-react'
import StatutBadge from '@/components/StatutBadge'

export const dynamic = 'force-dynamic'

export default async function ProspectsPage({ searchParams }) {
  const search = searchParams?.q ?? ''
  const statutFilter = searchParams?.statut ?? ''

  let query = supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`nom.ilike.%${search}%,entreprise.ilike.%${search}%,ville.ilike.%${search}%`)
  }
  if (statutFilter) {
    query = query.eq('statut', statutFilter)
  }

  const { data: prospects } = await query

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
        <div className="flex gap-2">
          <a href="/api/prospects/export" className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
            <Download size={14} /> CSV
          </a>
          <Link href="/prospects/nouveau" className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-3 py-1.5 rounded-md">
            <PlusCircle size={14} /> Nouveau
          </Link>
        </div>
      </div>

      <form method="GET" className="flex gap-2 flex-wrap">
        <input
          name="q"
          defaultValue={search}
          placeholder="Rechercher..."
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-56"
        />
        <select
          name="statut"
          defaultValue={statutFilter}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Tous les statuts</option>
          <option value="a_contacter">À contacter</option>
          <option value="contacte">Contacté</option>
          <option value="en_discussion">En discussion</option>
          <option value="proposition">Proposition</option>
          <option value="client">Client</option>
          <option value="perdu">Perdu</option>
        </select>
        <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-md">
          Filtrer
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {prospects?.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Aucun prospect trouvé.</p>
            <Link href="/prospects/nouveau" className="text-brand-600 text-sm mt-2 inline-block hover:underline">
              Ajouter le premier
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nom / Entreprise</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Secteur</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Ville</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Relance</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prospects?.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{p.nom}</p>
                    <p className="text-gray-500 text-xs">{p.entreprise}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{p.secteur}</td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{p.ville}</td>
                  <td className="py-3 px-4"><StatutBadge statut={p.statut} /></td>
                  <td className="py-3 px-4 text-gray-500 hidden lg:table-cell text-xs">
                    {p.prochaine_relance
                      ? format(new Date(p.prochaine_relance), 'd MMM yyyy', { locale: fr })
                      : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 justify-end">
                      {p.telephone && (
                        <a href={`tel:${p.telephone}`} className="text-gray-400 hover:text-brand-600"><Phone size={14} /></a>
                      )}
                      {p.email && (
                        <a href={`mailto:${p.email}`} className="text-gray-400 hover:text-brand-600"><Mail size={14} /></a>
                      )}
                      <Link href={`/prospects/${p.id}`} className="text-brand-600 hover:underline text-xs font-medium">
                        Voir
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
