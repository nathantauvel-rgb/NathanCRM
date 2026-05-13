import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req, { params }) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('prospects')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req, { params }) {
  const { error } = await supabase
    .from('prospects')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
