/** Un bloque de texto de un YAML: párrafo o lista (líneas que empiezan con "- "). */
export type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };

/**
 * Convierte un cuerpo de YAML en bloques. Párrafos separados por línea en blanco; un bloque cuyas líneas
 * empiezan todas con "- " es una lista. Nunca emite HTML en bruto: el texto se imprime como nodo de texto.
 */
export function toBlocks(text: string): Block[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split('\n').map((l) => l.trim());
      if (lines.every((l) => l.startsWith('- '))) return { kind: 'ul', items: lines.map((l) => l.slice(2).trim()) };
      return { kind: 'p', text: lines.join(' ') };
    });
}
