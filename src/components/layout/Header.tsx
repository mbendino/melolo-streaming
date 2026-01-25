import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="text-xl font-bold text-red-500">ReelShort</Link>
      </div>
    </header>
  )
}
