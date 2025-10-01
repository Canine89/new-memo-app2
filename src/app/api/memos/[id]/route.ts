import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const memo = await prisma.memo.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!memo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(memo)
  } catch (error) {
    console.error('메모 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      )
    }

    const memo = await prisma.memo.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!memo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const updatedMemo = await prisma.memo.update({
      where: {
        id
      },
      data: {
        title,
        content
      }
    })

    return NextResponse.json(updatedMemo)
  } catch (error) {
    console.error('메모 수정 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const memo = await prisma.memo.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!memo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    await prisma.memo.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: '메모가 삭제되었습니다.' })
  } catch (error) {
    console.error('메모 삭제 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
