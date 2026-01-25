import { DramaCard } from './DramaCard'
import { Skeleton } from '../ui/Skeleton'

interface Drama {
  id: string
  title: string
  cover: string
  episodes: number
}

export function DramaGrid({ dramas, isLoading }: { dramas: Drama[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      {dramas.map(d => <DramaCard key={d.id} drama={d} />)}
    </div>
  )
}
