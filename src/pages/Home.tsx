import { Link } from 'react-router-dom'
import { useDramasInfinite } from '../hooks/useDramas'

export default function Home() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDramasInfinite()
  const dramas = data?.pages.flat() || []

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="text-xl font-bold text-purple-500">Melolo</span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4">
        <h2 className="text-lg font-semibold mb-4">🔥 For You</h2>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {dramas.map((drama) => (
                <Link key={drama.id} to={`/watch/${drama.id}`} className="block">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
                    <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm font-medium mt-2 line-clamp-2">{drama.title}</h3>
                  <p className="text-xs text-zinc-400">{drama.episodes} eps</p>
                </Link>
              ))}
            </div>
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center gap-1 py-2 px-3 text-purple-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 py-2 px-3 text-zinc-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="text-xs font-medium">Search</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
