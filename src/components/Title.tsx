import { PanelTop } from 'lucide-react'

interface TitleProps {
  onClick?: () => void
  className?: string
}

const Title = ({ onClick, className = '' }: TitleProps) => (
  <button
    type="button"
    className={`flex items-center gap-2 text-xl font-bold focus:outline-none ${className}`}
    onClick={onClick || (() => window.location.replace('#/'))}
    aria-label="WEBX"
  >
    <PanelTop className="size-6 text-blue-600" />WEBX
  </button>
)

export default Title
