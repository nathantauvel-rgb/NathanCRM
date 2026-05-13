import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Phone, Mail, MapPin, ArrowLeft, Pencil, MessageSquare, PhoneCall, Calendar } from 'lucide-react'
import StatutBadge from '@/components/StatutBadge'
import InteractionForm from '@/components/InteractionForm'
import DeleteButton from '@/components/DeleteButton'

const TYPE_ICONS = {
  note: MessageSquare,
  appel: PhoneCall,
  email: Mail,
  whatsapp: MessageSquare,
  rdv: Calendar,
}

export const dynamic = 'force-dynamic'

export default async function ProspectDetailPage({ params }) {
  const { data: prospect } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!prospect) notFound()

  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .eq('prospect_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/prospects" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{prospect.nom}</h1>
          <p className="text-gray-500">{prospect.entreprise}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatutBadge statut={prospect.statut} />
          <Link
            href={`/prospects/${prospect.id}/modifier`}
            className="flex items-center gap-1.5 text-sm border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50"
          >
            <Pencil size={13} /> Modifier
          </Link>
          <DeleteButton prospectId={prospect.id} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prospect.telephone && (
          <a href={`tel:${prospect.telephone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-brand-600">
            <Phone size={15} className="text-gray-400" /> {prospect.telephone}
          </a>
        )}
        {prospect.email && (
          <a href={`mailto:${prospect.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-brand-600">
            <Mail size={15} className="text-gray-400" /> {prospect.email}
          </a>
        )}
        {prospect.ville && (
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={15} className="text-gray-400" /> {prospect.ville}
          </span>
        )}
        {prospect.secteur && (
          <span className="text-sm text-gray-700">
            <span className="text-gray-400 mr-1">Secteur :</span>{prospect.secteur}
          </span>
        )}
        {prospect.prochaine_relance && (
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar size={15} className="text-gray-400" />
            Relance le {format(new Date(prospect.prochaine_relance), 'd MMMM yyyy', { locale: fr })}
          </span>
        )}
      </div>

      {prospect.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800 whitespace-pre-wrap">{prospect.notes}</p>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Ajouter un échange</h2>
        <InteractionForm prospectId={prospect.id} />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900">Historique ({interactions?.length ?? 0})</h2>
        {interactions?.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun échange enregistré.</p>
        ) : (
          <div className="space-y-2">
            {interactions?.map(i => {
              const Icon = TYPE_ICONS[i.type] ?? MessageSquare
              return (
                <div key={i.id} className="bg-white border border-gray-200 rounded-lg p-3 flex gap-3">
                  <div className="mt-0.5 text-gray-400">
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{i.contenu}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(i.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                      {' · '}<span className="capitalize">{i.type}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
