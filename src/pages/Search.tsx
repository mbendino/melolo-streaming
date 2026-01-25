import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useSearch } from '../hooks/useDramas'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { data: dramas, isLoading } = useSearch(query)

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="text-xl font-bold text-purple-500">Melolo</span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari drama..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-800 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : query && dramas?.length ? (
          <div className="grid grid-cols-3 gap-3">
            {dramas.map((drama) => (
              <Link key={drama.id} to={`/watch/${drama.id}`} className="block">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                  <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-medium mt-2 line-clamp-2">{drama.title}</h3>
              </Link>
            ))}
          </div>
        ) : query ? (
          <p className="text-center text-zinc-400 py-8">Tidak ditemukan</p>
        ) : (
          <p className="text-center text-zinc-400 py-8">Ketik untuk mencari drama</p>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1 py-2 px-3 text-zinc-400 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 py-2 px-3 text-purple-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="text-xs font-medium">Search</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
