import { DnaAnalysisResult, ProteinAnalysisResult, AminoAcidCount } from '../types/bio';

// Standard 20 amino acids dictionary
export const AMINO_ACID_INFO: Record<
  string,
  { name: string; three: string; category: AminoAcidCount['category']; color: string; hydropathy: number; mw: number }
> = {
  A: { name: 'Alanine', three: 'Ala', category: 'Nonpolar', color: '#3B82F6', hydropathy: 1.8, mw: 89.09 },
  R: { name: 'Arginine', three: 'Arg', category: 'Basic', color: '#EF4444', hydropathy: -4.5, mw: 174.20 },
  N: { name: 'Asparagine', three: 'Asn', category: 'Polar', color: '#10B981', hydropathy: -3.5, mw: 132.12 },
  D: { name: 'Aspartic Acid', three: 'Asp', category: 'Acidic', color: '#DC2626', hydropathy: -3.5, mw: 133.10 },
  C: { name: 'Cysteine', three: 'Cys', category: 'Nonpolar', color: '#F59E0B', hydropathy: 2.5, mw: 121.16 },
  E: { name: 'Glutamic Acid', three: 'Glu', category: 'Acidic', color: '#B91C1C', hydropathy: -3.5, mw: 147.13 },
  Q: { name: 'Glutamine', three: 'Gln', category: 'Polar', color: '#059669', hydropathy: -3.5, mw: 146.15 },
  G: { name: 'Glycine', three: 'Gly', category: 'Nonpolar', color: '#6B7280', hydropathy: -0.4, mw: 75.07 },
  H: { name: 'Histidine', three: 'His', category: 'Basic', color: '#F87171', hydropathy: -3.2, mw: 155.16 },
  I: { name: 'Isoleucine', three: 'Ile', category: 'Nonpolar', color: '#2563EB', hydropathy: 4.5, mw: 131.18 },
  L: { name: 'Leucine', three: 'Leu', category: 'Nonpolar', color: '#1D4ED8', hydropathy: 3.8, mw: 131.18 },
  K: { name: 'Lysine', three: 'Lys', category: 'Basic', color: '#E11D48', hydropathy: -3.9, mw: 146.19 },
  M: { name: 'Methionine', three: 'Met', category: 'Nonpolar', color: '#D97706', hydropathy: 1.9, mw: 149.21 },
  F: { name: 'Phenylalanine', three: 'Phe', category: 'Aromatic', color: '#8B5CF6', hydropathy: 2.8, mw: 165.19 },
  P: { name: 'Proline', three: 'Pro', category: 'Nonpolar', color: '#4B5563', hydropathy: -1.6, mw: 115.13 },
  S: { name: 'Serine', three: 'Ser', category: 'Polar', color: '#34D399', hydropathy: -0.8, mw: 105.09 },
  T: { name: 'Threonine', three: 'Thr', category: 'Polar', color: '#6EE7B7', hydropathy: -0.7, mw: 119.12 },
  W: { name: 'Tryptophan', three: 'Trp', category: 'Aromatic', color: '#7C3AED', hydropathy: -0.9, mw: 204.23 },
  Y: { name: 'Tyrosine', three: 'Tyr', category: 'Aromatic', color: '#6D28D9', hydropathy: -1.3, mw: 181.19 },
  V: { name: 'Valine', three: 'Val', category: 'Nonpolar', color: '#1E40AF', hydropathy: 4.2, mw: 117.15 },
};

/**
 * Validates whether string is clean DNA
 */
export function validateDnaSequence(seq: string): { isValid: boolean; error?: string; cleanSeq: string } {
  const clean = seq.replace(/[\s\r\n\d]/g, '').toUpperCase();
  if (!clean) {
    return { isValid: false, error: 'Sequence is empty.', cleanSeq: '' };
  }
  // Check if it has protein-specific letters
  const proteinExclusive = /[EFILPQZ]/;
  if (proteinExclusive.test(clean)) {
    return {
      isValid: false,
      error: 'Invalid DNA sequence: contains amino acid residues (e.g. E, F, I, L, P, Q). Rejecting protein input.',
      cleanSeq: clean,
    };
  }
  // Check for invalid non-nucleotide characters
  const nonDna = /[^ACGTRYSWKMBDHVN]/;
  if (nonDna.test(clean)) {
    return {
      isValid: false,
      error: 'Invalid DNA sequence: contains unsupported characters. Only A, C, G, T, and standard IUPAC degenerate bases allowed.',
      cleanSeq: clean,
    };
  }
  return { isValid: true, cleanSeq: clean };
}

/**
 * Validates whether string is clean Protein
 */
export function validateProteinSequence(seq: string): { isValid: boolean; error?: string; cleanSeq: string } {
  const clean = seq.replace(/[\s\r\n\d*]/g, '').toUpperCase();
  if (!clean) {
    return { isValid: false, error: 'Protein sequence is empty.', cleanSeq: '' };
  }
  // Only 20 standard amino acids + rare selenocysteine/pyrrolysine/unknown (U, O, X)
  const invalid = /[^ACDEFGHIKLMNPQRSTVWYUO X]/;
  if (invalid.test(clean)) {
    return {
      isValid: false,
      error: 'Invalid protein sequence: contains non-amino acid characters.',
      cleanSeq: clean,
    };
  }
  return { isValid: true, cleanSeq: clean };
}

/**
 * Parse FASTA string into header and sequence
 */
export function parseFasta(fastaText: string): { header: string; sequence: string; isDna: boolean } {
  const lines = fastaText.trim().split('\n');
  let header = 'User Sequence';
  const seqLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      header = trimmed.substring(1).trim();
    } else if (trimmed) {
      seqLines.push(trimmed);
    }
  }

  const sequence = seqLines.join('').replace(/[\s\r\n\d]/g, '').toUpperCase();
  const dnaCheck = validateDnaSequence(sequence);
  return { header, sequence, isDna: dnaCheck.isValid };
}

/**
 * Perform comprehensive DNA analysis
 */
export function analyzeDna(sequence: string): DnaAnalysisResult {
  const seq = sequence.toUpperCase();
  const length = seq.length;
  let a = 0, t = 0, g = 0, c = 0, other = 0;

  for (let i = 0; i < length; i++) {
    const char = seq[i];
    if (char === 'A') a++;
    else if (char === 'T') t++;
    else if (char === 'G') g++;
    else if (char === 'C') c++;
    else other++;
  }

  const standardBases = a + t + g + c;
  const gcPercent = standardBases > 0 ? Number((((g + c) / standardBases) * 100).toFixed(2)) : 0;
  const atPercent = standardBases > 0 ? Number((((a + t) / standardBases) * 100).toFixed(2)) : 0;

  // Single-stranded DNA Molecular Weight approx (g/mol)
  // An = 313.21, Tn = 304.2, Gn = 329.21, Cn = 289.18
  const molecularWeight = Math.round(a * 313.21 + t * 304.2 + g * 329.21 + c * 289.18 - 61.96);

  // Melting Temperature (Tm)
  let meltingTempTm = 0;
  if (length > 0) {
    if (length < 14) {
      // Wallace Rule: Tm = 2*(A+T) + 4*(G+C)
      meltingTempTm = 2 * (a + t) + 4 * (g + c);
    } else {
      // Standard empirical formula for oligonucleotides:
      // Tm = 64.9 + 41 * (G + C - 16.4) / (A + T + G + C)
      meltingTempTm = Number((64.9 + (41 * (g + c - 16.4)) / standardBases).toFixed(1));
    }
  }

  const nucleotideComposition = [
    { base: 'Adenine (A)', count: a, percentage: length > 0 ? Number(((a / length) * 100).toFixed(2)) : 0, color: '#3B82F6' },
    { base: 'Thymine (T)', count: t, percentage: length > 0 ? Number(((t / length) * 100).toFixed(2)) : 0, color: '#EF4444' },
    { base: 'Guanine (G)', count: g, percentage: length > 0 ? Number(((g / length) * 100).toFixed(2)) : 0, color: '#10B981' },
    { base: 'Cytosine (C)', count: c, percentage: length > 0 ? Number(((c / length) * 100).toFixed(2)) : 0, color: '#F59E0B' },
  ];

  if (other > 0) {
    nucleotideComposition.push({
      base: 'Other / Degenerate',
      count: other,
      percentage: Number(((other / length) * 100).toFixed(2)),
      color: '#9CA3AF',
    });
  }

  return {
    length,
    aCount: a,
    tCount: t,
    gCount: g,
    cCount: c,
    otherCount: other,
    gcPercent,
    atPercent,
    molecularWeight,
    meltingTempTm,
    nucleotideComposition,
  };
}

/**
 * Perform comprehensive Protein analysis
 */
export function analyzeProtein(sequence: string): ProteinAnalysisResult {
  const seq = sequence.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, '');
  const length = seq.length;

  const counts: Record<string, number> = {};
  for (const aa of Object.keys(AMINO_ACID_INFO)) {
    counts[aa] = 0;
  }

  for (let i = 0; i < length; i++) {
    const aa = seq[i];
    if (counts[aa] !== undefined) {
      counts[aa]++;
    }
  }

  // Molecular weight: sum of amino acid weights - (n-1)*18.015 (water lost per peptide bond)
  let sumResidueMw = 0;
  for (const [aa, count] of Object.entries(counts)) {
    sumResidueMw += count * (AMINO_ACID_INFO[aa]?.mw || 110);
  }
  const waterLoss = length > 1 ? (length - 1) * 18.015 : 0;
  const molecularWeight = Math.round(sumResidueMw - waterLoss);

  // GRAVY (Grand average of hydropathicity)
  let totalHydropathy = 0;
  for (const [aa, count] of Object.entries(counts)) {
    totalHydropathy += count * (AMINO_ACID_INFO[aa]?.hydropathy || 0);
  }
  const gravy = length > 0 ? Number((totalHydropathy / length).toFixed(3)) : 0;

  // Extinction Coefficient at 280 nm (Edelhoch method)
  // W: 5500, Y: 1490, C: 125 (assume cystine pairs)
  const tyr = counts['Y'] || 0;
  const trp = counts['W'] || 0;
  const cys = counts['C'] || 0;
  const extinctionCoefficient = trp * 5500 + tyr * 1490 + Math.floor(cys / 2) * 125;

  // Aliphatic Index: X(Ala) + 2.9 * X(Val) + 3.9 * (X(Ile) + X(Leu))
  const ala = counts['A'] || 0;
  const val = counts['V'] || 0;
  const ile = counts['I'] || 0;
  const leu = counts['L'] || 0;
  const aliphaticIndex = length > 0
    ? Number((((ala + 2.9 * val + 3.9 * (ile + leu)) / length) * 100).toFixed(2))
    : 0;

  // Charge at pH 7.4 & Isoelectric Point (pI)
  const pI = calculateIsoelectricPoint(counts);
  const chargeAtPh74 = calculateNetChargeAtPh(counts, 7.4);

  const composition: AminoAcidCount[] = Object.keys(AMINO_ACID_INFO).map(aa => {
    const info = AMINO_ACID_INFO[aa];
    const count = counts[aa] || 0;
    return {
      aminoAcid: info.name,
      singleLetter: aa,
      threeLetter: info.three,
      count,
      percentage: length > 0 ? Number(((count / length) * 100).toFixed(2)) : 0,
      category: info.category,
      color: info.color,
    };
  });

  return {
    length,
    molecularWeight,
    isoelectricPoint: pI,
    gravy,
    extinctionCoefficient,
    chargeAtPh74,
    aliphaticIndex,
    composition,
  };
}

// pKa values for pI calculation
const PK_TERMINAL_N = 9.69;
const PK_TERMINAL_C = 2.34;
const PKA_VALUES: Record<string, number> = {
  C: 8.33,
  D: 3.86,
  E: 4.25,
  H: 6.00,
  K: 10.53,
  R: 12.48,
  Y: 10.00,
};

function calculateNetChargeAtPh(counts: Record<string, number>, ph: number): number {
  // N-terminal positive charge
  let charge = 1.0 / (1.0 + Math.pow(10, ph - PK_TERMINAL_N));
  // C-terminal negative charge
  charge -= 1.0 / (1.0 + Math.pow(10, PK_TERMINAL_C - ph));

  // Positive side chains: Lys, Arg, His
  charge += (counts['K'] || 0) / (1.0 + Math.pow(10, ph - PKA_VALUES['K']));
  charge += (counts['R'] || 0) / (1.0 + Math.pow(10, ph - PKA_VALUES['R']));
  charge += (counts['H'] || 0) / (1.0 + Math.pow(10, ph - PKA_VALUES['H']));

  // Negative side chains: Asp, Glu, Cys, Tyr
  charge -= (counts['D'] || 0) / (1.0 + Math.pow(10, PKA_VALUES['D'] - ph));
  charge -= (counts['E'] || 0) / (1.0 + Math.pow(10, PKA_VALUES['E'] - ph));
  charge -= (counts['C'] || 0) / (1.0 + Math.pow(10, PKA_VALUES['C'] - ph));
  charge -= (counts['Y'] || 0) / (1.0 + Math.pow(10, PKA_VALUES['Y'] - ph));

  return Number(charge.toFixed(2));
}

function calculateIsoelectricPoint(counts: Record<string, number>): number {
  let minPh = 0.0;
  let maxPh = 14.0;
  const precision = 0.001;

  while (maxPh - minPh > precision) {
    const midPh = (minPh + maxPh) / 2.0;
    const currentCharge = calculateNetChargeAtPh(counts, midPh);
    if (currentCharge > 0) {
      minPh = midPh;
    } else {
      maxPh = midPh;
    }
  }

  return Number(((minPh + maxPh) / 2.0).toFixed(2));
}
