import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProspectForm from '@/components/ProspectForm'

export default async function ModifierProspectPage({ params }) {
  const { data: prospect } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!prospect) notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Modifier — {prospect.nom}</h1>
      <ProspectForm prospect={prospect} />
    </div>
  )
}
