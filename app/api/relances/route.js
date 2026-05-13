import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Cette route est appelée chaque matin par un cron Vercel (ou Make)
// Elle envoie les relances du jour vers Make, qui envoie le WhatsApp
export async function GET(req) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: relances, error } = await supabase
    .from('prospects')
    .select('id,nom,entreprise,telephone,statut,prochaine_relance')
    .eq('prochaine_relance', today)
    .not('statut', 'in', '("client","perdu")')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!relances || relances.length === 0) {
    return NextResponse.json({ sent: 0, message: 'Aucune relance aujourd\'hui' })
  }

  const makeUrl = process.env.MAKE_WEBHOOK_URL
  if (!makeUrl) return NextResponse.json({ error: 'MAKE_WEBHOOK_URL manquant' }, { status: 500 })

  // Envoi vers Make en une seule requête avec la liste complète
  const res = await fetch(makeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: today,
      nb_relances: relances.length,
      relances: relances.map(p => ({
        id: p.id,
        nom: p.nom,
        entreprise: p.entreprise,
        telephone: p.telephone,
        statut: p.statut,
      })),
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Erreur Make webhook' }, { status: 502 })
  }

  return NextResponse.json({ sent: relances.length, relances })
}
