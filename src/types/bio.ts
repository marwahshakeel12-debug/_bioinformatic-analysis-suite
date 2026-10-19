export type SequenceType = 'DNA' | 'RNA' | 'PROTEIN';

export interface UserRecord {
  userId: string; // e.g. BIO001
  username: string;
  passwordHash: string;
  registrationDate: string;
}

export interface BiologicalSequence {
  id: string;
  name: string;
  accession: string;
  organism: string;
  description: string;
  type: SequenceType;
  sequence: string;
  length: number;
  source: 'NCBI' | 'UNIPROT' | 'FILE_UPLOAD' | 'MANUAL' | 'EXAMPLE';
  fastaHeader?: string;
}

export interface DnaAnalysisResult {
  length: number;
  aCount: number;
  tCount: number;
  gCount: number;
  cCount: number;
  otherCount: number;
  gcPercent: number;
  atPercent: number;
  molecularWeight: number; // in g/mol
  meltingTempTm: number; // Wallace rule or nearest-neighbor approx
  nucleotideComposition: { base: string; count: number; percentage: number; color: string }[];
}

export interface AminoAcidCount {
  aminoAcid: string;
  singleLetter: string;
  threeLetter: string;
  count: number;
  percentage: number;
  category: 'Nonpolar' | 'Polar' | 'Acidic' | 'Basic' | 'Aromatic';
  color: string;
}

export interface ProteinAnalysisResult {
  length: number;
  molecularWeight: number; // Da
  isoelectricPoint: number; // pI
  gravy: number; // Grand Average of Hydropathicity
  extinctionCoefficient: number; // M^-1 cm^-1
  chargeAtPh74: number;
  aliphaticIndex: number;
  composition: AminoAcidCount[];
}

export interface OrfResult {
  id: number;
  frame: '+1' | '+2' | '+3' | '-1' | '-2' | '-3';
  start: number; // 1-based start
  stop: number;  // 1-based stop
  length: number; // in nucleotides
  dnaSequence: string;
  translatedProtein: string;
  isLongest?: boolean;
}

export interface MotifResult {
  motif: string;
  totalOccurrences: number;
  positions: number[]; // 1-based indexes
}

export interface AlignmentResult {
  type: 'DNA' | 'PROTEIN';
  refSeqName: string;
  querySeqName: string;
  alignedRef: string;
  alignedQuery: string;
  consensus: string;
  score: number;
  matches: number;
  mismatches: number;
  gaps: number;
  identityPercentage: number;
  similarityPercentage: number;
  length: number;
}

export type MutationType = 'Substitution' | 'Insertion' | 'Deletion';

export interface MutationVariant {
  id: string;
  position: number; // 1-based reference position
  reference: string;
  query: string;
  mutationType: MutationType;
  subtype?: 'Transition' | 'Transversion' | 'Frameshift' | 'In-frame';
  codonRef?: string;
  codonQuery?: string;
  aaRef?: string;
  aaQuery?: string;
  impact?: 'Synonymous' | 'Missense' | 'Nonsense' | 'Non-coding' | 'Indel';
}

export interface MLMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
  };
  featureImportance: { feature: string; importance: number }[];
  datasetSize: number;
}

export interface MLPredictionResult {
  classification: 'Promoter' | 'Non-promoter';
  probability: number;
  featuresExtracted: {
    length: number;
    gcPercent: number;
    cpgCount: number;
    tataBoxScore: number;
    inrScore: number;
    kmerSignature: string;
  };
}

export type ThemeMode = 'blush-gold' | 'warm-ivory' | 'science-blue' | 'dark-slate';

export type DashboardTab =
  | 'home'
  | 'search'
  | 'analysis-workspace'
  | 'analysis-tools'
  | 'dna-analysis'
  | 'orf-analysis'
  | 'translation'
  | 'protein-analysis'
  | 'motif-search'
  | 'alignment'
  | 'mutation'
  | 'vcf'
  | 'machine-learning'
  | 'population-map'
  | 'visualization'
  | 'reports'
  | 'architecture-docs'
  | 'settings'
  | 'orf-motif';
