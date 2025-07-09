import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: ReactNode
  className?: string
}

function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2 className={cn('text-2xl font-bold mb-4', className)}>{children}</h2>
  )
}

export default SectionTitle
