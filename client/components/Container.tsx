import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

function Container({ children, className = '' }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export default Container;
