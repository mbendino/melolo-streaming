import { Link } from 'react-router-dom'

interface Drama {
  id: string
  title: string
  cover: string
  episodes: number
}

export function DramaCard({ drama }: { drama: Drama }) {
  return (
    <Link to={`/watch/${drama.id}`} className="block">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
        <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
          <p className="text-xs line-clamp-2">{drama.title}</p>
        </div>
      </div>
    </Link>
  )
}
