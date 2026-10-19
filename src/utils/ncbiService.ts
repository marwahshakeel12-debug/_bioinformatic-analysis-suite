import { BiologicalSequence, SequenceType } from '../types/bio';
import { validateDnaSequence, validateProteinSequence } from './bioAlgorithms';

export const CURATED_DATABASE_RECORDS: BiologicalSequence[] = [
  {
    id: 'CUR_01',
    name: 'BRCA1',
    accession: 'NM_007294.4',
    organism: 'Homo sapiens (Human)',
    description: 'BRCA1 DNA repair associated, mRNA transcript variant 1, tumor suppressor involved in double-strand break repair',
    type: 'DNA',
    sequence:
      'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATAACCAAAAGGAGCCTACAAGAAAGTACGAGATTTAGTCAACTTGTTGAAGAG',
    length: 258,
    source: 'NCBI',
    fastaHeader: 'NM_007294.4 Homo sapiens BRCA1 DNA repair associated, mRNA (CDS fragment)',
  },
  {
    id: 'CUR_02',
    name: 'TP53',
    accession: 'NM_000546.6',
    organism: 'Homo sapiens (Human)',
    description: 'Tumor protein p53, guardian of the genome, transcriptional activator controlling cell cycle arrest and apoptosis',
    type: 'DNA',
    sequence:
      'ATGGAGGAGCCGCAGTCAGATCCTAGCGTCGAGCCCCCTCTGAGTCAGGAAACATTTTCAGACCTATGGAAACTACTTCCTGAAAACAACGTTCTGTCCCCCTTGCCGTCCCAAGCAATGGATGATTTGATGCTGTCCCCGGACGATATTGAACAATGGTTCACTGAAGACCCAGGTCCAGATGAAGCTCCCAGAATGCCAGAGGCTGCTCCCCGCGTGGCCCCTGCACCAGCAGCTCCTACACCGGCGGCCCCT',
    length: 261,
    source: 'NCBI',
    fastaHeader: 'NM_000546.6 Homo sapiens TP53 tumor protein p53, mRNA (CDS fragment)',
  },
  {
    id: 'CUR_03',
    name: 'INS',
    accession: 'NM_000207.3',
    organism: 'Homo sapiens (Human)',
    description: 'Insulin preproprotein, peptide hormone regulating blood glucose levels and carbohydrate metabolism',
    type: 'DNA',
    sequence:
      'ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTTTGTGAACCAACACCTGTGCGGCTCACACCTGGTGGAAGCTCTCTACCTAGTGTGCGGGGAACGAGGCTTCTTCTACACACCCAAGACCCGCCGGGAGGCAGAGGACCTGCAGGTGGGGCAGGTGGAGCTGGGCGGTGGCCCTGGTGCAGGCAGCCTGCAGCCCTTGGCCCTGGAGGGGTCCCTGCAG',
    length: 264,
    source: 'NCBI',
    fastaHeader: 'NM_000207.3 Homo sapiens insulin (INS), mRNA (CDS complete)',
  },
  {
    id: 'CUR_04',
    name: 'HBB (Hemoglobin Beta)',
    accession: 'NM_000518.5',
    organism: 'Homo sapiens (Human)',
    description: 'Hemoglobin subunit beta, oxygen transport protein; mutations lead to Sickle Cell Anemia (HbS) or Beta-Thalassemia',
    type: 'DNA',
    sequence:
      'ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTT',
    length: 261,
    source: 'NCBI',
    fastaHeader: 'NM_000518.5 Homo sapiens hemoglobin subunit beta (HBB), mRNA',
  },
  {
    id: 'CUR_05',
    name: 'EGFR',
    accession: 'NM_005228.5',
    organism: 'Homo sapiens (Human)',
    description: 'Epidermal growth factor receptor, transmembrane receptor tyrosine kinase; clinical target in non-small cell lung cancer',
    type: 'DNA',
    sequence:
      'ATGCGACCCTCCGGGACGGCCGGGGCAGCGCTCCTGGCGCTGCTGGCTGCGCTCTGCCCGGCGAGTCGGGCTCTGGAGGAAAAGAAAGTTTGCCAAGGCACGAGTAACAAGCTCACGCAGTTGGGCACTTTTGAAGATCATTTTCTCAGCCTCCAGAGGATGTTCAATAACTGTGAGGTGGTCCTTGGGAATTTGGAAATTACCTATGTGCAGAGGAATTATGATCTTTCCTTCTTAAAGACCATCCAGGAGGTGGCC',
    length: 261,
    source: 'NCBI',
    fastaHeader: 'NM_005228.5 Homo sapiens epidermal growth factor receptor (EGFR), mRNA',
  },
  {
    id: 'CUR_06',
    name: 'TP53 (Protein)',
    accession: 'P04637',
    organism: 'Homo sapiens (Human)',
    description: 'Cellular tumor antigen p53, sequence-specific DNA-binding transcription factor regulating senescence and apoptosis',
    type: 'PROTEIN',
    sequence:
      'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLED',
    length: 264,
    source: 'UNIPROT',
    fastaHeader: 'sp|P04637|P53_HUMAN Cellular tumor antigen p53 OS=Homo sapiens OX=9606 GN=TP53 PE=1 SV=4',
  },
  {
    id: 'CUR_07',
    name: 'Insulin (Protein)',
    accession: 'P01308',
    organism: 'Homo sapiens (Human)',
    description: 'Insulin A and B chains, hormone produced by pancreatic beta cells stimulating glucose uptake and glycogen synthesis',
    type: 'PROTEIN',
    sequence:
      'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN',
    length: 110,
    source: 'UNIPROT',
    fastaHeader: 'sp|P01308|INS_HUMAN Insulin OS=Homo sapiens OX=9606 GN=INS PE=1 SV=1',
  },
  {
    id: 'CUR_08',
    name: 'Cytochrome c',
    accession: 'P99999',
    organism: 'Homo sapiens (Human)',
    description: 'Cytochrome c, electron transport chain hemeprotein involved in mitochondrial oxidative phosphorylation and apoptosis',
    type: 'PROTEIN',
    sequence:
      'MGDVEKGKKIFIMKCSQCHTVEKGGKHKTGPNLHGLFGRKTGQAPGYSYTAANKNKGIIWGEDTLMEYLENPKKYIPGTKMIFVGIKKKEERADLIAYLKKATNE',
    length: 105,
    source: 'UNIPROT',
    fastaHeader: 'sp|P99999|CYC_HUMAN Cytochrome c OS=Homo sapiens OX=9606 GN=CYCS PE=1 SV=2',
  },
];

export type SearchFilterType = 'AUTO' | 'GENE' | 'DNA' | 'PROTEIN' | 'ALL';

export type DetectedInputType = 'GENE' | 'DNA' | 'PROTEIN' | 'ACCESSION';

export interface DetectionResult {
  type: DetectedInputType;
  confidence: 'HIGH' | 'MEDIUM';
  label: string;
  cleanSeq?: string;
  estimatedType?: SequenceType;
}

/**
 * Automatically inspects the search query to identify if it is:
 * - A DNA sequence (pure nucleotides A, C, G, T, U, N or IUPAC)
 * - A Protein polypeptide (amino acid sequence)
 * - An Accession ID (e.g. NM_007294, P04637, NC_000017)
 * - A Gene / Target name (e.g. BRCA1, TP53, EGFR, Insulin)
 */
export function detectBiologicalInputType(rawQuery: string): DetectionResult {
  const q = rawQuery.trim();
  if (!q) {
    return { type: 'GENE', confidence: 'MEDIUM', label: 'Gene / Target Name' };
  }

  // Handle pasted FASTA format
  let seqCandidate = q;
  if (q.startsWith('>')) {
    const lines = q.split('\n');
    seqCandidate = lines.slice(1).join('');
  }
  const clean = seqCandidate.replace(/[\s\r\n\d]/g, '').toUpperCase();

  // 1. Accession ID detection
  const accessionPattern = /^((NC|NM|NP|NR|XM|XP|NG|NZ|BX|AL|AC)_[0-9]+(\.[0-9]+)?|[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9][A-Z][A-Z0-9]{2}[0-9]|ENST[0-9]+|ENSG[0-9]+)$/i;
  if (accessionPattern.test(q)) {
    return {
      type: 'ACCESSION',
      confidence: 'HIGH',
      label: `Accession Number (${q})`,
      estimatedType: q.toUpperCase().startsWith('NP_') || /^[OPQ][0-9]/.test(q) ? 'PROTEIN' : 'DNA',
    };
  }

  // 2. Direct sequence detection (length >= 10)
  if (clean.length >= 10) {
    // Check if DNA: only A, C, G, T, N, U
    const isStandardDna = /^[ACGTNU]+$/.test(clean);
    if (isStandardDna) {
      return {
        type: 'DNA',
        confidence: 'HIGH',
        label: `DNA Sequence (${clean.length} bp)`,
        cleanSeq: clean,
        estimatedType: 'DNA',
      };
    }

    // Check if standard 20 amino acids
    const isProtein = /^[ACDEFGHIKLMNPQRSTVWY]+$/.test(clean);
    if (isProtein) {
      return {
        type: 'PROTEIN',
        confidence: 'HIGH',
        label: `Protein Sequence (${clean.length} aa)`,
        cleanSeq: clean,
        estimatedType: 'PROTEIN',
      };
    }
  }

  // 3. Fallback to Gene / Target symbol
  return {
    type: 'GENE',
    confidence: 'MEDIUM',
    label: 'Gene / Protein Identifier',
  };
}

/**
 * Searches biological databases (Curated benchmarks, live UniProtKB, live NCBI Entrez, or direct sequence inputs)
 */
export async function searchBiologicalDatabase(
  query: string,
  filterType: SearchFilterType = 'AUTO'
): Promise<BiologicalSequence[]> {
  const q = query.trim();
  if (!q) return [];

  // Check if query is a direct sequence (DNA or Protein)
  const detected = detectBiologicalInputType(q);
  if (detected.cleanSeq && (detected.type === 'DNA' || detected.type === 'PROTEIN')) {
    const isDna = detected.type === 'DNA';
    const seqType: SequenceType = isDna ? 'DNA' : 'PROTEIN';

    // If user explicitly specified filter that contradicts detected type, proceed to database query
    if (
      (filterType === 'DNA' && !isDna) ||
      (filterType === 'PROTEIN' && isDna) ||
      filterType === 'GENE'
    ) {
      // Continue to DB search
    } else {
      const customRecord: BiologicalSequence = {
        id: `DIRECT_${Date.now()}`,
        name: isDna ? `Custom DNA Sequence` : `Custom Polypeptide`,
        accession: isDna ? `SEQ_DNA_${detected.cleanSeq.substring(0, 8)}` : `SEQ_PROT_${detected.cleanSeq.substring(0, 8)}`,
        organism: 'User-Provided Input',
        description: `Direct sequence input submitted via search bar (${detected.cleanSeq.length} ${isDna ? 'bp' : 'aa'}). Ready for comprehensive downstream analysis.`,
        type: seqType,
        sequence: detected.cleanSeq,
        length: detected.cleanSeq.length,
        source: 'MANUAL',
        fastaHeader: `User_Sequence length=${detected.cleanSeq.length} type=${seqType}`,
      };
      return [customRecord];
    }
  }

  const qLower = q.toLowerCase();
  const effectiveFilter = filterType === 'AUTO' || filterType === 'ALL' || filterType === 'GENE' ? 'ALL' : filterType;

  // 1. Check curated database first for instant, validated matches
  const curatedMatches = CURATED_DATABASE_RECORDS.filter(rec => {
    const matchesQuery =
      rec.name.toLowerCase().includes(qLower) ||
      rec.accession.toLowerCase().includes(qLower) ||
      rec.description.toLowerCase().includes(qLower) ||
      rec.organism.toLowerCase().includes(qLower);

    if (!matchesQuery) return false;
    if (effectiveFilter === 'ALL') return true;
    return rec.type === effectiveFilter;
  });

  if (curatedMatches.length > 0) {
    return curatedMatches;
  }

  const liveResults: BiologicalSequence[] = [];

  // 2. Query UniProtKB if searching for proteins or ALL
  if (effectiveFilter === 'ALL' || effectiveFilter === 'PROTEIN') {
    try {
      const uniprotUrl = `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(
        q
      )}&format=json&size=4`;
      const uniRes = await fetch(uniprotUrl);
      if (uniRes.ok) {
        const uniData = await uniRes.json();
        const results = uniData?.results || [];

        for (const entry of results) {
          const accession = entry.primaryAccession;
          const entryName = entry.uniProtkbId || accession;
          const proteinName =
            entry.proteinDescription?.recommendedName?.fullName?.value ||
            entry.genes?.[0]?.geneName?.value ||
            entryName;
          const organism = entry.organism?.scientificName || 'Homo sapiens';
          const seq = entry.sequence?.value || '';

          if (seq) {
            liveResults.push({
              id: `UNIPROT_${accession}`,
              name: proteinName,
              accession,
              organism,
              description: `${proteinName} [UniProtKB ${accession}]`,
              type: 'PROTEIN',
              sequence: seq.toUpperCase(),
              length: seq.length,
              source: 'UNIPROT',
              fastaHeader: `sp|${accession}|${entryName} ${proteinName} OS=${organism}`,
            });
          }
        }
      }
    } catch (err) {
      console.warn('UniProt API query encountered error:', err);
    }
  }

  // 3. Query NCBI Entrez if searching for DNA or ALL
  if (effectiveFilter === 'ALL' || effectiveFilter === 'DNA') {
    try {
      const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nuccore&term=${encodeURIComponent(
        q
      )}&retmax=3&retmode=json`;
      const searchRes = await fetch(esearchUrl);

      if (searchRes.ok) {
        const data = await searchRes.json();
        const idList: string[] = data?.esearchresult?.idlist || [];

        for (const id of idList) {
          const efetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${id}&rettype=fasta&retmode=text`;
          const fetchRes = await fetch(efetchUrl);

          if (fetchRes.ok) {
            const fastaText = await fetchRes.text();
            const lines = fastaText.trim().split('\n');
            const header = lines[0] ? lines[0].replace(/^>/, '') : `NCBI_${id}`;
            const rawSeq = lines.slice(1).join('').replace(/[\s\r\n\d]/g, '').toUpperCase();

            if (rawSeq.length > 0) {
              const dnaCheck = validateDnaSequence(rawSeq);
              const isDna = dnaCheck.isValid;

              liveResults.push({
                id: `NCBI_${id}`,
                name: header.split(' ')[0] || q.toUpperCase(),
                accession: id,
                organism: header.includes('Homo sapiens') ? 'Homo sapiens (Human)' : 'Organism via NCBI',
                description: header,
                type: isDna ? 'DNA' : 'PROTEIN',
                sequence: rawSeq.substring(0, 3000), // bounded for browser processing
                length: Math.min(3000, rawSeq.length),
                source: 'NCBI',
                fastaHeader: header,
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('NCBI E-utilities query error:', err);
    }
  }

  if (liveResults.length > 0) {
    return effectiveFilter === 'ALL' ? liveResults : liveResults.filter(r => r.type === effectiveFilter);
  }

  // Return empty array when no matches are found
  return [];
}

export function formatFasta(record: BiologicalSequence): string {
  const header = record.fastaHeader || `${record.accession} ${record.name} ${record.organism} ${record.description}`;
  // 60-character line wrapping standard for FASTA format
  const seqWrapped = record.sequence.match(/.{1,60}/g)?.join('\n') || record.sequence;
  return `>${header}\n${seqWrapped}`;
}

export function downloadFastaFile(record: BiologicalSequence): void {
  const fastaText = formatFasta(record);
  const blob = new Blob([fastaText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${record.name || record.accession || 'sequence'}.fasta`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
