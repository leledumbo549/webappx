
interface TitleProps {
  onClick?: () => void
  className?: string
}

const Title = ({ onClick, className = '' }: TitleProps) => (
  <button
    type="button"
    className={`flex items-center gap-2 text-4xl font-bold focus:outline-none ${className}`}
    onClick={onClick || (() => window.location.replace('#/'))}
    aria-label="WEBX"
  >
    <span>
      WEB<span className="text-blue-900">X</span>
    </span>
  </button>
)

export default Title
