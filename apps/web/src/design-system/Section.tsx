import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Container } from './Container';

type Background = 'default' | 'tinted' | 'muted' | 'inverted';
type Padding = 'none' | 'sm' | 'md' | 'lg';

type Element = keyof Pick<JSX.IntrinsicElements, 'div' | 'section' | 'article' | 'header' | 'footer' | 'main'>;

const backgroundStyles: Record<Background, string> = {
  default: 'bg-transparent',
  tinted: 'bg-white/70 backdrop-blur',
  muted: 'bg-sand-100/60',
  inverted: 'bg-ink-900 text-white'
};

const paddingStyles: Record<Padding, string> = {
  none: 'py-0',
  sm: 'py-10 sm:py-12',
  md: 'py-14 sm:py-16',
  lg: 'py-20 sm:py-24'
};

export type SectionProps<T extends Element = 'section'> = {
  as?: T;
  background?: Background;
  bleed?: boolean;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  padding?: Padding;
  paddedContainer?: boolean;
} & Omit<HTMLAttributes<HTMLElementTagNameMap[T]>, 'children'>;

export const Section = <T extends Element = 'section'>(
  {
    as,
    background = 'default',
    bleed = false,
    children,
    className,
    containerClassName,
    id,
    padding = 'lg',
    paddedContainer = true,
    ...props
  }: SectionProps<T>
) => {
  const Component = as ?? 'section';

  return (
    <Component
      className={cn(
        'relative',
        backgroundStyles[background],
        paddingStyles[padding],
        bleed && 'px-0',
        className
      )}
      id={id}
      {...props}
    >
      <Container className={containerClassName} padded={paddedContainer}>
        {children}
      </Container>
    </Component>
  );
};

Section.displayName = 'Section';
