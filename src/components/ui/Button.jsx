function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function buttonClass({ variant = 'solid', fullWidth = false } = {}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';
  const tone = {
    solid: 'bg-brand text-white hover:bg-brand-dark shadow-md',
    outline:
      'border-2 border-brand bg-white text-brand hover:bg-brand-muted',
    light: 'bg-white text-brand hover:bg-brand-beige shadow-lg',
    ghost: 'text-neutral-700 hover:bg-brand-muted hover:text-brand',
  }[variant];

  return cx(base, tone, fullWidth && 'w-full');
}

export default function Button({
  as: Comp = 'button',
  type = 'button',
  className = '',
  variant = 'solid',
  fullWidth = false,
  ...props
}) {
  return (
    <Comp
      type={Comp === 'button' ? type : undefined}
      className={cx(buttonClass({ variant, fullWidth }), className)}
      {...props}
    />
  );
}
