import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('prospect_id', params.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req, { params }) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('interactions')
    .insert({ ...body, prospect_id: params.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
