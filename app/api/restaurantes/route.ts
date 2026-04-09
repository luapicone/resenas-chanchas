import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const restaurantes = await prisma.restaurante.findMany({
      include: {
        resenas: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(restaurantes)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching restaurantes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { nombre, categoria, direccion, ciudad } = body

    if (!nombre || !categoria) {
      return NextResponse.json({ error: 'Nombre y categoría son requeridos' }, { status: 400 })
    }

    const restaurante = await prisma.restaurante.create({
      data: { nombre, categoria, direccion, ciudad },
    })

    return NextResponse.json(restaurante, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating restaurante' }, { status: 500 })
  }
}
