import { forwardRef } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  ReactNode
} from 'react';
import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type BaseProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  leadingIcon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type PolymorphicProps = ButtonAsButton | ButtonAsAnchor;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white shadow-elevated hover:bg-brand-600 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  secondary:
    'bg-white text-brand-600 shadow-soft hover:text-brand-700 focus-visible:ring-brand-100 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  tertiary:
    'bg-ink-900 text-white hover:bg-ink-800 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900',
  ghost:
    'bg-transparent text-ink-700 hover:text-brand-600 hover:bg-brand-50 focus-visible:ring-brand-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-[0.7rem] px-4 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-sm px-6 py-3'
};

const contentStyles: Record<ButtonSize, string> = {
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3'
};

const renderIcon = (icon: ReactNode, position: 'leading' | 'trailing') => (
  <span
    aria-hidden
    className={cn(
      'inline-flex items-center justify-center text-base',
      position === 'leading' ? '-ml-1' : '-mr-1'
    )}
  >
    {icon}
  </span>
);

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, PolymorphicProps>(
  (
    { as = 'button', children, className, icon, leadingIcon, size = 'md', variant = 'primary', ...rest },
    ref
  ) => {
    const Component = as as ElementType;
    const componentProps =
      as === 'button'
        ? {
            ...rest,
            type: (rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'
          }
        : rest;

    return (
      <Component
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-[0.14em] transition-all duration-200 focus:outline-none focus-visible:outline-none',
          sizeStyles[size],
          contentStyles[size],
          variantStyles[variant],
          className
        )}
        ref={ref as never}
        {...componentProps}
      >
        {leadingIcon && renderIcon(leadingIcon, 'leading')}
        <span className="whitespace-nowrap">{children}</span>
        {icon && renderIcon(icon, 'trailing')}
      </Component>
    );
  }
);

Button.displayName = 'Button';
