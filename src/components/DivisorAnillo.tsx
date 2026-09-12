/** Un solo anillo, centrado, al inicio de la sección "La boda" (§8.2). */
export function DivisorAnillo({ className }: { className?: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      style={{ color: 'var(--acento)' }}
      className={className}
      aria-hidden="true"
    >
      <circle cx={11} cy={11} r={6.4} />
    </svg>
  );
}
