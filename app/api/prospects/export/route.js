import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data } = await supabase
    .from('prospects')
    .select('nom,entreprise,secteur,telephone,email,ville,statut,prochaine_relance,notes,created_at')
    .order('created_at', { ascending: false })

  const headers = ['Nom','Entreprise','Secteur','Téléphone','Email','Ville','Statut','Prochaine relance','Notes','Créé le']
  const rows = (data ?? []).map(p => [
    p.nom, p.entreprise, p.secteur, p.telephone, p.email, p.ville,
    p.statut, p.prochaine_relance, p.notes?.replace(/\n/g, ' '), p.created_at?.split('T')[0],
  ].map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="prospects.csv"',
    },
  })
}
