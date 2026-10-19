import { AlignmentResult, MutationVariant, MutationType } from '../types/bio';
import { CODON_TABLE } from './orfAndTranslation';
import { AMINO_ACID_INFO } from './bioAlgorithms';

export function detectMutations(alignment: AlignmentResult): MutationVariant[] {
  const { alignedRef, alignedQuery, type } = alignment;
  const variants: MutationVariant[] = [];

  let refCoordinate = 0; // 1-based position in reference sequence
  let variantIndex = 1;

  const purines = new Set(['A', 'G']);
  const pyrimidines = new Set(['C', 'T']);

  const len = alignedRef.length;
  let k = 0;

  while (k < len) {
    const rChar = alignedRef[k];
    const qChar = alignedQuery[k];

    if (rChar !== '-') {
      refCoordinate++;
    }

    if (rChar === qChar) {
      k++;
      continue;
    }

    // Substitution
    if (rChar !== '-' && qChar !== '-') {
      let subtype: 'Transition' | 'Transversion' | undefined;
      if (type === 'DNA') {
        const isPurineTransition = purines.has(rChar) && purines.has(qChar);
        const isPyrimidineTransition = pyrimidines.has(rChar) && pyrimidines.has(qChar);
        subtype = isPurineTransition || isPyrimidineTransition ? 'Transition' : 'Transversion';
      }

      // Check codon context for DNA
      let codonRef: string | undefined;
      let codonQuery: string | undefined;
      let aaRef: string | undefined;
      let aaQuery: string | undefined;
      let impact: MutationVariant['impact'] = 'Non-coding';

      if (type === 'DNA') {
        // Approximate codon based on 0-based index in un-gapped sequence
        const zeroIndex = refCoordinate - 1;
        const codonOffset = zeroIndex % 3;
        const codonStartInRef = zeroIndex - codonOffset;

        // Try to sample codon if bounds permit
        const unalignedRef = alignedRef.replace(/-/g, '');
        const unalignedQuery = alignedQuery.replace(/-/g, '');

        if (codonStartInRef + 3 <= unalignedRef.length && codonStartInRef + 3 <= unalignedQuery.length) {
          codonRef = unalignedRef.substring(codonStartInRef, codonStartInRef + 3);
          codonQuery = unalignedQuery.substring(codonStartInRef, codonStartInRef + 3);
          aaRef = CODON_TABLE[codonRef] || '?';
          aaQuery = CODON_TABLE[codonQuery] || '?';

          if (aaRef === aaQuery) {
            impact = 'Synonymous';
          } else if (aaQuery === '*') {
            impact = 'Nonsense';
          } else {
            impact = 'Missense';
          }
        }
      } else {
        impact = 'Missense';
        aaRef = rChar;
        aaQuery = qChar;
      }

      variants.push({
        id: `VAR_${String(variantIndex++).padStart(3, '0')}`,
        position: refCoordinate,
        reference: rChar,
        query: qChar,
        mutationType: 'Substitution',
        subtype,
        codonRef,
        codonQuery,
        aaRef,
        aaQuery,
        impact,
      });

      k++;
    }
    // Deletion: reference has bases, query has '-'
    else if (rChar !== '-' && qChar === '-') {
      const startRefPos = refCoordinate;
      let delRefBases = rChar;
      k++;

      while (k < len && alignedRef[k] !== '-' && alignedQuery[k] === '-') {
        delRefBases += alignedRef[k];
        refCoordinate++;
        k++;
      }

      variants.push({
        id: `VAR_${String(variantIndex++).padStart(3, '0')}`,
        position: startRefPos,
        reference: delRefBases,
        query: '-',
        mutationType: 'Deletion',
        subtype: delRefBases.length % 3 === 0 ? 'In-frame' : 'Frameshift',
        impact: 'Indel',
      });
    }
    // Insertion: reference has '-', query has bases
    else if (rChar === '-' && qChar !== '-') {
      let insBases = qChar;
      const insPos = Math.max(1, refCoordinate);
      k++;

      while (k < len && alignedRef[k] === '-' && alignedQuery[k] !== '-') {
        insBases += alignedQuery[k];
        k++;
      }

      variants.push({
        id: `VAR_${String(variantIndex++).padStart(3, '0')}`,
        position: insPos,
        reference: '-',
        query: insBases,
        mutationType: 'Insertion',
        subtype: insBases.length % 3 === 0 ? 'In-frame' : 'Frameshift',
        impact: 'Indel',
      });
    } else {
      k++;
    }
  }

  return variants;
}
