import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center items-center py-10', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { Spinner };
