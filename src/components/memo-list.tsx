'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'
import MemoForm from './memo-form'
import { Memo } from '@/types/memo'

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMemos()
  }, [])

  const fetchMemos = async () => {
    try {
      const response = await fetch('/api/memos')
      if (response.ok) {
        const data = await response.json()
        setMemos(data)
      }
    } catch (error) {
      console.error('메모 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMemo = async (title: string, content: string) => {
    try {
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const newMemo = await response.json()
        setMemos([newMemo, ...memos])
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('메모 생성 오류:', error)
    }
  }

  const handleUpdateMemo = async (id: string, title: string, content: string) => {
    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const updatedMemo = await response.json()
        setMemos(memos.map(memo => 
          memo.id === id ? updatedMemo : memo
        ))
        setEditingMemo(null)
      }
    } catch (error) {
      console.error('메모 수정 오류:', error)
    }
  }

  const handleDeleteMemo = async (id: string) => {
    if (!confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMemos(memos.filter(memo => memo.id !== id))
      }
    } catch (error) {
      console.error('메모 삭제 오류:', error)
    }
  }

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingMemo(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">메모 목록</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          새 메모
        </Button>
      </div>

      {isFormOpen && (
        <MemoForm
          memo={editingMemo}
          onSubmit={editingMemo ? 
            (title, content) => handleUpdateMemo(editingMemo.id, title, content) :
            handleCreateMemo
          }
          onClose={handleFormClose}
        />
      )}

      {memos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">아직 메모가 없습니다</p>
              <p className="text-sm">새 메모를 작성해보세요!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memos.map((memo) => (
            <Card key={memo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{memo.title}</CardTitle>
                <div className="text-xs text-muted-foreground">
                  {new Date(memo.updatedAt).toLocaleDateString('ko-KR')}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {memo.content}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(memo)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMemo(memo.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
