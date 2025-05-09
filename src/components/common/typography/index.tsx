'use client';

import { cn } from '@/utils/tailwind';
import { VariantProps, cva } from 'class-variance-authority';
/**
 * Typography component
 * @param {string} variant - The variant of the typography.
 * @param {string} weight - The weight of the typography.
 * @param {string} align - The alignment of the typography.
 * @param {React.ElementType} as - The element type to render the typography as.
 * @param {React.ReactNode} children - The children of the typography.
 * @param {string} className - The class name to apply to the typography.
 * @param {React.ComponentPropsWithoutRef<C>} props - The props to apply to the typography.
 * @returns {React.ReactElement} The typography component.
 * @example
 * <Typography>Nomal text</Typography>
 * <Typography variant="h1">Heading 1</Typography>
 * <Typography variant="h2">Heading 2</Typography>
 * <Typography variant="h3">Heading 3</Typography>
 * <Typography variant="lead">Lead text</Typography>
 * <Typography variant="large">Large text</Typography>
 * <Typography variant="small">Small text</Typography>
 * <Typography variant="muted">Muted text</Typography>
 * <Typography weight="normal">Normal text</Typography>
 * <Typography weight="medium">Medium text</Typography>
 * <Typography weight="bold">Bold text</Typography>
 * <Typography align="left">Align left</Typography>
 * <Typography align="center">Align center</Typography>
 * <Typography align="right">Align right</Typography>
 * <Typography variant="h1" align="center" weight="bold">Heading 1 align center and bold</Typography>
 * <Typography as="span" variant="small">Inline text</Typography>
 * <Typography as="label" variant="muted">Form label</Typography>
 * <Typography className="my-4 text-blue-500">Text with margin and custom color</Typography>
 */
const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold',
      h3: 'scroll-m-20 text-2xl font-semibold',
      h4: 'scroll-m-20 text-xl font-semibold',
      h5: 'scroll-m-20 text-lg font-semibold',
      p: 'text-base',
      small: 'text-sm',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      embossed: 'text-embossed',
      submerged: 'text-submerged',
      boosted: 'text-boosted',
      destructive: 'text-destructive',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
  },
  defaultVariants: {
    variant: 'p',
    weight: 'normal',
    align: 'left',
    color: 'embossed',
  },
});
interface TypographyProps<C extends React.ElementType>
  extends VariantProps<typeof typographyVariants> {
  as?: C;
  children: React.ReactNode;
  className?: string;
  props?: React.ComponentPropsWithoutRef<C>;
}

export function Typography<C extends React.ElementType = 'p'>({
  className,
  variant,
  weight,
  align,
  color,
  size,
  as,
  children,
  ...props
}: TypographyProps<C>) {
  const Component = as || (variant as React.ElementType) || ('p' as React.ElementType);
  return (
    <Component
      className={cn(typographyVariants({ variant, weight, align, color, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
