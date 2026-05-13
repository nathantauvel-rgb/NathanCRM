'use client'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Link from 'next/link'
import { Phone, Mail, Calendar, ChevronRight } from 'lucide-react'
import StatutBadge from './StatutBadge'
import { format, isPast, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'

const COLUMNS = [
  { id: 'a_contacter',   label: 'À contacter',        color: 'bg-gray-500' },
  { id: 'contacte',      label: 'Contacté',            color: 'bg-blue-500' },
  { id: 'en_discussion', label: 'En discussion',       color: 'bg-yellow-500' },
  { id: 'proposition',   label: 'Proposition envoyée', color: 'bg-purple-500' },
  { id: 'client',        label: 'Client',              color: 'bg-green-500' },
  { id: 'perdu',         label: 'Perdu',               color: 'bg-red-400' },
]

function groupByStatut(prospects) {
  const groups = {}
  COLUMNS.forEach(c => { groups[c.id] = [] })
  prospects.forEach(p => {
    if (groups[p.statut]) groups[p.statut].push(p)
    else groups['a_contacter'].push(p)
  })
  return groups
}

function RelanceTag({ date }) {
  if (!date) return null
  const d = new Date(date)
  const late = isPast(d) && !isToday(d)
  const today = isToday(d)
  return (
    <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded
      ${late ? 'bg-red-100 text-red-700' : today ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
      <Calendar size={10} />
      {format(d, 'd MMM', { locale: fr })}
    </span>
  )
}

function ProspectCard({ prospect, index }) {
  return (
    <Draggable draggableId={prospect.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border p-3 space-y-2 cursor-grab active:cursor-grabbing
            ${snapshot.isDragging ? 'shadow-lg border-brand-300' : 'border-gray-200 hover:border-gray-300'}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{prospect.nom}</p>
              <p className="text-xs text-gray-500 truncate">{prospect.entreprise}</p>
            </div>
            <Link href={`/prospects/${prospect.id}`} className="text-gray-400 hover:text-brand-600 shrink-0">
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {prospect.ville && (
              <span className="text-xs text-gray-400">{prospect.ville}</span>
            )}
            {prospect.secteur && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{prospect.secteur}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {prospect.telephone && (
                <a href={`tel:${prospect.telephone}`} className="text-gray-400 hover:text-brand-600">
                  <Phone size={13} />
                </a>
              )}
              {prospect.email && (
                <a href={`mailto:${prospect.email}`} className="text-gray-400 hover:text-brand-600">
                  <Mail size={13} />
                </a>
              )}
            </div>
            <RelanceTag date={prospect.prochaine_relance} />
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default function KanbanBoard({ prospects: initialProspects }) {
  const [groups, setGroups] = useState(() => groupByStatut(initialProspects))

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = [...groups[source.droppableId]]
    const destCol = source.droppableId === destination.droppableId
      ? sourceCol
      : [...groups[destination.droppableId]]

    const [moved] = sourceCol.splice(source.index, 1)
    moved.statut = destination.droppableId
    destCol.splice(destination.index, 0, moved)

    setGroups(g => ({
      ...g,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }))

    await fetch(`/api/prospects/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: destination.droppableId }),
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const cards = groups[col.id] ?? []
          return (
            <div key={col.id} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {cards.length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column space-y-2 rounded-lg p-2 transition-colors
                      ${snapshot.isDraggingOver ? 'bg-brand-50' : 'bg-gray-100'}`}
                  >
                    {cards.map((p, i) => (
                      <ProspectCard key={p.id} prospect={p} index={i} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
