import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Header from '@/components/header'
import MemoList from '@/components/memo-list'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">내 메모</h1>
          <div className="text-sm text-muted-foreground">
            안녕하세요, {session.user.name || session.user.email}님!
          </div>
        </div>
        <MemoList />
      </div>
    </div>
  )
}
