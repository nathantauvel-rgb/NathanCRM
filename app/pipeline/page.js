import { supabase } from '@/lib/supabase'
import KanbanBoard from '@/components/KanbanBoard'

export const dynamic = 'force-dynamic'

export default async function PipelinePage() {
  const { data: prospects } = await supabase
    .from('prospects')
    .select('id,nom,entreprise,secteur,ville,telephone,email,statut,prochaine_relance')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
      <KanbanBoard prospects={prospects ?? []} />
    </div>
  )
}
