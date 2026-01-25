import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
