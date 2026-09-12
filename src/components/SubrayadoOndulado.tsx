/** Onda dibujada a mano bajo el H1 del hero y bajo el "¡Gracias!" del paso 4 (§8.1). */
export function SubrayadoOndulado({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 10"
      width={132}
      height={10}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      style={{ color: 'var(--acento)' }}
      className={className}
      aria-hidden="true"
    >
      <path d="M1.5 6.5Q12 .8 22.5 6.5T43.5 6.5T64.5 6.5T85.5 6.5T106.5 6.5T130.5 6.5" />
    </svg>
  );
}
