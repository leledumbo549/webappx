interface TitleProps {
  onClick?: () => void
  className?: string
}

import { Button } from './ui/button'

const Title = ({ onClick, className = '' }: TitleProps) => (
  <Button
    type="button"
    variant="ghost"
    className={`flex items-center gap-2 text-4xl font-bold focus-visible:ring ${className}`}
    onClick={onClick || (() => window.location.replace('#/'))}
    aria-label="WEBX"
  >
    <span>
      WEB<span className="text-blue-900">X</span>
    </span>
  </Button>
)

export default Title
