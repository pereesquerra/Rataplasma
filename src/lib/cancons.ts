// Cançons senzilles amb notes en solfeig i durades.
// Format: [nota_index (0=Do, 1=Re, 2=Mi, 3=Fa, 4=Sol, 5=La, 6=Si, 7=Do agut), durada_en_beats]
// Durada 1 = corxera, 2 = negra, 4 = blanca

export interface Cançó {
  id: string
  titol: string
  bpm: number
  notes: [number, number][]
}

export const CANÇONS: Cançó[] = [
  {
    id: 'sol-solet',
    titol: 'Sol Solet',
    bpm: 100,
    notes: [
      [4, 2], [4, 2], [2, 2], [2, 2],  // Sol Sol Mi Mi
      [4, 2], [2, 2], [0, 4],           // Sol Mi Do
      [4, 2], [4, 2], [2, 2], [2, 2],  // Sol Sol Mi Mi
      [4, 2], [2, 2], [0, 4],           // Sol Mi Do
    ],
  },
  {
    id: 'mary',
    titol: 'Mary Had a Little Lamb',
    bpm: 110,
    notes: [
      [2, 2], [1, 2], [0, 2], [1, 2],   // Mi Re Do Re
      [2, 2], [2, 2], [2, 4],            // Mi Mi Mi
      [1, 2], [1, 2], [1, 4],            // Re Re Re
      [2, 2], [4, 2], [4, 4],            // Mi Sol Sol
    ],
  },
  {
    id: 'cumpleanys',
    titol: 'Per molts anys',
    bpm: 90,
    notes: [
      [0, 1], [0, 1], [1, 2], [0, 2], [3, 2], [2, 4],   // Do Do Re Do Fa Mi
      [0, 1], [0, 1], [1, 2], [0, 2], [4, 2], [3, 4],   // Do Do Re Do Sol Fa
    ],
  },
  {
    id: 'rataplasma',
    titol: 'Cançó de la Rata',
    bpm: 140,
    notes: [
      [0, 1], [2, 1], [4, 1], [7, 2],   // Do Mi Sol Do'
      [5, 1], [4, 1], [2, 2],            // La Sol Mi
      [0, 1], [2, 1], [4, 1], [7, 2],   // Do Mi Sol Do'
      [5, 2], [7, 4],                    // La Do' (final)
    ],
  },
]
