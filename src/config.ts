/**
 * Flags de configuración del sitio (§15 de la espec).
 * Son tema/props del árbol, no un panel de UI para el invitado.
 */
export type EstiloFoto = 'polaroid' | 'marco';

export type Config = {
  /** Color de acento. Los derivados (alpha y el acento oscuro de texto) se recalculan solos. */
  acento: string;
  /** `polaroid` inclina el marco y le deja "mentón"; `marco` va recto y ajustado. */
  estiloFoto: EstiloFoto;
  /** Muestra las miniaturas cuadradas de la lista de regalos. */
  miniaturas: boolean;
  /** Muestra la nota descriptiva bajo cada regalo. */
  notas: boolean;
};

export const CONFIG: Config = {
  acento: '#B06E6E',
  estiloFoto: 'polaroid',
  miniaturas: true,
  notas: false,
};
