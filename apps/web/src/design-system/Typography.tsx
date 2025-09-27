import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingSizes: Record<HeadingLevel, string> = {
  1: 'text-4xl sm:text-5xl lg:text-6xl',
  2: 'text-3xl sm:text-4xl',
  3: 'text-2xl sm:text-3xl',
  4: 'text-xl sm:text-2xl',
  5: 'text-lg',
  6: 'text-base'
};

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
};

export const Heading = ({ level = 2, className, ...props }: HeadingProps) => {
  const Component = `h${level}` as const;

  return (
    <Component
      className={cn('font-display font-semibold tracking-tight text-ink-900', headingSizes[level], className)}
      {...props}
    />
  );
};

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement>;

export const Eyebrow = ({ className, ...props }: EyebrowProps) => (
  <p
    className={cn(
      'text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-600',
      className
    )}
    {...props}
  />
);

export type BodyProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: 'default' | 'muted' | 'light';
};

const bodyVariants = {
  default: 'text-base leading-relaxed text-ink-700',
  muted: 'text-sm leading-relaxed text-ink-600',
  light: 'text-base leading-relaxed text-white/80'
};

export const Body = ({ className, variant = 'default', ...props }: BodyProps) => (
  <p className={cn(bodyVariants[variant], className)} {...props} />
);

export type CaptionProps = HTMLAttributes<HTMLSpanElement>;

export const Caption = ({ className, ...props }: CaptionProps) => (
  <span className={cn('text-xs uppercase tracking-[0.18em] text-ink-500', className)} {...props} />
);
