import { OrfResult, MotifResult } from '../types/bio';
import { AMINO_ACID_INFO } from './bioAlgorithms';

// Standard 64-codon Genetic Code Table
export const CODON_TABLE: Record<string, string> = {
  // Phenylalanine & Leucine
  TTT: 'F', TTC: 'F', TTA: 'L', TTG: 'L',
  // Leucine
  CTT: 'L', CTC: 'L', CTA: 'L', CTG: 'L',
  // Isoleucine & Methionine (Start)
  ATT: 'I', ATC: 'I', ATA: 'I', ATG: 'M',
  // Valine
  GTT: 'V', GTC: 'V', GTA: 'V', GTG: 'V',
  // Serine
  TCT: 'S', TCC: 'S', TCA: 'S', TCG: 'S',
  // Proline
  CCT: 'P', CCC: 'P', CCA: 'P', CCG: 'P',
  // Threonine
  ACT: 'T', ACC: 'T', ACA: 'T', ACG: 'T',
  // Alanine
  GCT: 'A', GCC: 'A', GCA: 'A', GCG: 'A',
  // Tyrosine & Stop
  TAT: 'Y', TAC: 'Y', TAA: '*', TAG: '*',
  // Histidine & Glutamine
  CAT: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
  // Asparagine & Lysine
  AAT: 'N', AAC: 'N', AAA: 'K', AAG: 'K',
  // Aspartic Acid & Glutamic Acid
  GAT: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
  // Cysteine, Stop & Tryptophan
  TGT: 'C', TGC: 'C', TGA: '*', TGG: 'W',
  // Arginine
  CGT: 'R', CGC: 'R', CGA: 'R', CGG: 'R',
  // Serine & Arginine
  AGT: 'S', AGC: 'S', AGA: 'R', AGG: 'R',
  // Glycine
  GGT: 'G', GGC: 'G', GGA: 'G', GGG: 'G',
};

const STOP_CODONS = new Set(['TAA', 'TAG', 'TGA']);

/**
 * Returns reverse complement of a DNA string
 */
export function getReverseComplement(dna: string): string {
  const complementMap: Record<string, string> = {
    A: 'T', T: 'A', G: 'C', C: 'G',
    R: 'Y', Y: 'R', S: 'S', W: 'W',
    K: 'M', M: 'K', B: 'V', V: 'B',
    D: 'H', H: 'D', N: 'N',
  };
  return dna
    .toUpperCase()
    .split('')
    .reverse()
    .map(c => complementMap[c] || 'N')
    .join('');
}

/**
 * Translates a DNA sequence into an amino acid sequence
 */
export function translateDna(dna: string, frame: number = 0, stopAtAsterisk: boolean = false): {
  protein: string;
  codons: { codon: string; aa: string; threeLetter: string; pos: number }[];
} {
  const clean = dna.toUpperCase().replace(/[^A-Z]/g, '');
  const codons: { codon: string; aa: string; threeLetter: string; pos: number }[] = [];
  const aaList: string[] = [];

  for (let i = frame; i + 3 <= clean.length; i += 3) {
    const codon = clean.substring(i, i + 3);
    const aa = CODON_TABLE[codon] || 'X';
    const threeLetter = aa === '*' ? 'Stop' : AMINO_ACID_INFO[aa]?.three || 'Unk';

    codons.push({ codon, aa, threeLetter, pos: i + 1 });
    aaList.push(aa);

    if (stopAtAsterisk && aa === '*') {
      break;
    }
  }

  return { protein: aaList.join(''), codons };
}

/**
 * Finds all Open Reading Frames across all 6 reading frames (+1, +2, +3, -1, -2, -3)
 */
export function findOpenReadingFrames(dna: string, minLengthBp: number = 30): OrfResult[] {
  const clean = dna.toUpperCase().replace(/[^A-Z]/g, '');
  const seqLength = clean.length;
  const orfs: OrfResult[] = [];
  let orfId = 1;

  // Search forward frames: +1 (offset 0), +2 (offset 1), +3 (offset 2)
  const forwardFrames: ('+1' | '+2' | '+3')[] = ['+1', '+2', '+3'];
  forwardFrames.forEach((frameStr, frameIdx) => {
    let inOrf = false;
    let startPos = -1;

    for (let i = frameIdx; i + 3 <= seqLength; i += 3) {
      const codon = clean.substring(i, i + 3);
      if (!inOrf && codon === 'ATG') {
        inOrf = true;
        startPos = i;
      } else if (inOrf && STOP_CODONS.has(codon)) {
        const stopPos = i + 3;
        const orfDna = clean.substring(startPos, stopPos);
        if (orfDna.length >= minLengthBp) {
          const { protein } = translateDna(orfDna, 0, false);
          orfs.push({
            id: orfId++,
            frame: frameStr,
            start: startPos + 1, // 1-based
            stop: stopPos,       // 1-based
            length: orfDna.length,
            dnaSequence: orfDna,
            translatedProtein: protein,
          });
        }
        inOrf = false;
        startPos = -1;
      }
    }
  });

  // Search reverse frames: -1, -2, -3 on reverse complement
  const revComp = getReverseComplement(clean);
  const reverseFrames: ('-1' | '-2' | '-3')[] = ['-1', '-2', '-3'];
  reverseFrames.forEach((frameStr, frameIdx) => {
    let inOrf = false;
    let startPos = -1;

    for (let i = frameIdx; i + 3 <= seqLength; i += 3) {
      const codon = revComp.substring(i, i + 3);
      if (!inOrf && codon === 'ATG') {
        inOrf = true;
        startPos = i;
      } else if (inOrf && STOP_CODONS.has(codon)) {
        const stopPos = i + 3;
        const orfDna = revComp.substring(startPos, stopPos);
        if (orfDna.length >= minLengthBp) {
          const { protein } = translateDna(orfDna, 0, false);
          // Convert reverse-complement coordinates back to original forward sequence (1-based)
          const origStart = seqLength - stopPos + 1;
          const origStop = seqLength - startPos;
          orfs.push({
            id: orfId++,
            frame: frameStr,
            start: origStart,
            stop: origStop,
            length: orfDna.length,
            dnaSequence: orfDna,
            translatedProtein: protein,
          });
        }
        inOrf = false;
        startPos = -1;
      }
    }
  });

  // Sort by length descending, mark the longest ORF
  orfs.sort((a, b) => b.length - a.length);
  if (orfs.length > 0) {
    orfs[0].isLongest = true;
  }

  return orfs;
}

/**
 * Searches for motif occurrences within a sequence
 */
export function findMotifs(sequence: string, motif: string): MotifResult {
  const cleanSeq = sequence.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanMotif = motif.toUpperCase().replace(/[^A-Z]/g, '');

  if (!cleanSeq || !cleanMotif) {
    return { motif: cleanMotif, totalOccurrences: 0, positions: [] };
  }

  const positions: number[] = [];
  let index = cleanSeq.indexOf(cleanMotif, 0);

  while (index !== -1) {
    positions.push(index + 1); // 1-based
    index = cleanSeq.indexOf(cleanMotif, index + 1);
  }

  return {
    motif: cleanMotif,
    totalOccurrences: positions.length,
    positions,
  };
}
