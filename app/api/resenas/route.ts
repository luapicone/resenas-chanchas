import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { restauranteId, puntaje, comentario, visitadoEn } = body

    if (!restauranteId || !puntaje || !comentario) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    let fechaVisita = null
    if (visitadoEn && visitadoEn.trim() !== '') {
      const parts = visitadoEn.split('-')
      if (parts.length === 3) {
        fechaVisita = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0)
      }
    }

    const resena = await prisma.resena.upsert({
      where: {
        userId_restauranteId: {
          userId: session.user.id,
          restauranteId,
        },
      },
      update: {
        puntaje: Number(puntaje),
        comentario,
        visitadoEn: fechaVisita,
      },
      create: {
        puntaje: Number(puntaje),
        comentario,
        visitadoEn: fechaVisita,
        userId: session.user.id,
        restauranteId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json(resena, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error saving reseña' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const resena = await prisma.resena.findUnique({ where: { id } })
    if (!resena || resena.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await prisma.resena.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting reseña' }, { status: 500 })
  }
}
