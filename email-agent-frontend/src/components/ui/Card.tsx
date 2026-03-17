import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div 
      className={cn(
        'relative bg-[#050505] border border-white/[0.06] rounded-lg p-5 transition-all overflow-hidden',
        hoverable && 'hover:border-white/[0.12]',
        className
      )}
    >
      {children}
      {hoverable && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}
