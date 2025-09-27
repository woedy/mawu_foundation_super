import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

const sizeStyles = {
  sm: 'max-w-4xl',
  md: 'max-w-6xl',
  lg: 'max-w-[120rem]'
};

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  size?: keyof typeof sizeStyles;
} & HTMLAttributes<HTMLDivElement>;

export const Container = ({
  children,
  className,
  padded = true,
  size = 'lg',
  ...props
}: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeStyles[size],
        padded && 'px-6 sm:px-8 lg:px-12',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';
