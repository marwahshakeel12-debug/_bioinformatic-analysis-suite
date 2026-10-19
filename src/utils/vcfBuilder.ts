import { MutationVariant } from '../types/bio';

export interface VcfGenerationOptions {
  chrom?: string;
  referenceName?: string;
  source?: string;
}

export function generateVcfContent(
  variants: MutationVariant[],
  options: VcfGenerationOptions = {}
): string {
  const chrom = options.chrom || 'chr17'; // default common chromosome (e.g. BRCA1/TP53)
  const refName = options.referenceName || 'RefSeq_Contig_001';
  const source = options.source || 'IntegratedBioinformaticsAnalysisSoftware_v1.0';

  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const headerLines = [
    '##fileformat=VCFv4.2',
    `##fileDate=${dateStr}`,
    `##source=${source}`,
    `##reference=${refName}`,
    '##INFO=<ID=TYPE,Number=1,Type=String,Description="Type of variant: Substitution, Insertion, Deletion">',
    '##INFO=<ID=SUBTYPE,Number=1,Type=String,Description="Subtype: Transition, Transversion, Frameshift, In-frame">',
    '##INFO=<ID=IMPACT,Number=1,Type=String,Description="Predicted functional impact: Synonymous, Missense, Nonsense, Indel, Non-coding">',
    '##INFO=<ID=AA_CHANGE,Number=1,Type=String,Description="Amino acid change (RefAA>AltAA)">',
    '##INFO=<ID=CODON_CHANGE,Number=1,Type=String,Description="Codon change (RefCodon>AltCodon)">',
    '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO',
  ];

  const variantLines = variants.map(v => {
    // Format REF and ALT according to VCF spec:
    // If insertion (ref='-'), VCF convention prepends preceding base or uses standard notation
    const ref = v.reference === '-' ? 'N' : v.reference;
    const alt = v.query === '-' ? '.' : v.query;

    const infoParts: string[] = [
      `TYPE=${v.mutationType}`,
    ];

    if (v.subtype) infoParts.push(`SUBTYPE=${v.subtype}`);
    if (v.impact) infoParts.push(`IMPACT=${v.impact}`);
    if (v.aaRef && v.aaQuery) infoParts.push(`AA_CHANGE=${v.aaRef}>${v.aaQuery}`);
    if (v.codonRef && v.codonQuery) infoParts.push(`CODON_CHANGE=${v.codonRef}>${v.codonQuery}`);

    const info = infoParts.join(';');
    const qual = '100';
    const filter = 'PASS';

    return `${chrom}\t${v.position}\t${v.id}\t${ref}\t${alt}\t${qual}\t${filter}\t${info}`;
  });

  return [...headerLines, ...variantLines].join('\n');
}

export function downloadVcfFile(vcfContent: string, filename: string = 'variants.vcf'): void {
  const blob = new Blob([vcfContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.vcf') ? filename : `${filename}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
