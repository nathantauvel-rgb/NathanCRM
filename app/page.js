import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { format, isToday, isPast, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Users, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import StatutBadge from '@/components/StatutBadge'

async function getStats() {
  const today = new Date().toISOString().split('T')[0]
  const in7days = addDays(new Date(), 7).toISOString().split('T')[0]

  const [{ count: total }, { count: clients }, { data: relancesAujourd }, { data: relancesRetard }, { data: relancesSemaine }] =
    await Promise.all([
      supabase.from('prospects').select('*', { count: 'exact', head: true }),
      supabase.from('prospects').select('*', { count: 'exact', head: true }).eq('statut', 'client'),
      supabase.from('prospects').select('id,nom,entreprise,telephone,statut,prochaine_relance')
        .eq('prochaine_relance', today).not('statut', 'in', '("client","perdu")').order('nom'),
      supabase.from('prospects').select('id,nom,entreprise,telephone,statut,prochaine_relance')
        .lt('prochaine_relance', today).not('statut', 'in', '("client","perdu")').order('prochaine_relance'),
      supabase.from('prospects').select('id,nom,entreprise,telephone,statut,prochaine_relance')
        .gt('prochaine_relance', today).lte('prochaine_relance', in7days).not('statut', 'in', '("client","perdu")').order('prochaine_relance'),
    ])

  return { total, clients, relancesAujourd: relancesAujourd ?? [], relancesRetard: relancesRetard ?? [], relancesSemaine: relancesSemaine ?? [] }
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function RelanceRow({ prospect }) {
  const date = prospect.prochaine_relance
    ? format(new Date(prospect.prochaine_relance), 'd MMM', { locale: fr })
    : null
  return (
    <Link href={`/prospects/${prospect.id}`}
      className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="min-w-0">
        <p className="font-medium text-sm text-gray-900">{prospect.nom}</p>
        <p className="text-xs text-gray-500">{prospect.entreprise}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatutBadge statut={prospect.statut} />
        {date && <span className="text-xs text-gray-400">{date}</span>}
        {prospect.telephone && (
          <a href={`tel:${prospect.telephone}`}
            className="text-brand-600 text-xs font-medium hover:underline">
            Appeler
          </a>
        )}
      </div>
    </Link>
  )
}

export default async function Dashboard() {
  const { total, clients, relancesAujourd, relancesRetard, relancesSemaine } = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users}       label="Total prospects"    value={total ?? 0}   color="bg-blue-500" />
        <StatCard icon={TrendingUp}  label="Clients actifs"     value={clients ?? 0} color="bg-green-500" />
        <StatCard icon={AlertCircle} label="En retard"          value={relancesRetard.length}   color="bg-red-500" />
        <StatCard icon={Calendar}    label="À relancer ce soir" value={relancesAujourd.length}  color="bg-orange-500" />
      </div>

      {relancesRetard.length > 0 && (
        <section className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
            <AlertCircle size={16} /> Relances en retard ({relancesRetard.length})
          </h2>
          <div className="divide-y divide-red-100">
            {relancesRetard.map(p => <RelanceRow key={p.id} prospect={p} />)}
          </div>
        </section>
      )}

      {relancesAujourd.length > 0 && (
        <section className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h2 className="font-semibold text-orange-800 flex items-center gap-2 mb-3">
            <Clock size={16} /> À relancer aujourd'hui ({relancesAujourd.length})
          </h2>
          <div className="divide-y divide-orange-100">
            {relancesAujourd.map(p => <RelanceRow key={p.id} prospect={p} />)}
          </div>
        </section>
      )}

      {relancesAujourd.length === 0 && relancesRetard.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-700 font-medium">Aucune relance urgente aujourd'hui ✓</p>
        </div>
      )}

      {relancesSemaine.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Calendar size={16} /> Cette semaine ({relancesSemaine.length})
          </h2>
          <div className="divide-y divide-gray-100">
            {relancesSemaine.map(p => <RelanceRow key={p.id} prospect={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
