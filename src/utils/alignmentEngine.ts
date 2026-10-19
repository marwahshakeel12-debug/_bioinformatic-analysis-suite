import { AlignmentResult } from '../types/bio';

/**
 * Needleman-Wunsch Global Alignment Implementation
 */
export function alignSequences(
  seq1: string,
  seq2: string,
  type: 'DNA' | 'PROTEIN' = 'DNA',
  refName: string = 'Reference Sequence',
  queryName: string = 'Query Sequence'
): AlignmentResult {
  const s1 = seq1.toUpperCase().replace(/[^A-Z]/g, '');
  const s2 = seq2.toUpperCase().replace(/[^A-Z]/g, '');

  const m = s1.length;
  const n = s2.length;

  if (m === 0 || n === 0) {
    return {
      type,
      refSeqName: refName,
      querySeqName: queryName,
      alignedRef: s1,
      alignedQuery: s2,
      consensus: '',
      score: 0,
      matches: 0,
      mismatches: 0,
      gaps: 0,
      identityPercentage: 0,
      similarityPercentage: 0,
      length: 0,
    };
  }

  // Scoring parameters
  const MATCH = type === 'DNA' ? 2 : 3;
  const MISMATCH = -1;
  const GAP = -2;

  // Initialize DP Matrix
  // Using 1D arrays or typed flat arrays to keep memory small and fast
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i * GAP;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j * GAP;
  }

  // Fill Matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = s1[i - 1] === s2[j - 1] ? MATCH : MISMATCH;
      const diag = dp[i - 1][j - 1] + matchScore;
      const up = dp[i - 1][j] + GAP;
      const left = dp[i][j - 1] + GAP;
      dp[i][j] = Math.max(diag, up, left);
    }
  }

  // Traceback
  let aligned1 = '';
  let aligned2 = '';
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const matchScore = s1[i - 1] === s2[j - 1] ? MATCH : MISMATCH;
      if (dp[i][j] === dp[i - 1][j - 1] + matchScore) {
        aligned1 = s1[i - 1] + aligned1;
        aligned2 = s2[j - 1] + aligned2;
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + GAP) {
      aligned1 = s1[i - 1] + aligned1;
      aligned2 = '-' + aligned2;
      i--;
    } else {
      aligned1 = '-' + aligned1;
      aligned2 = s2[j - 1] + aligned2;
      j--;
    }
  }

  // Compute metrics and consensus line
  let matches = 0;
  let mismatches = 0;
  let gaps = 0;
  let consensus = '';

  const totalLen = aligned1.length;
  for (let k = 0; k < totalLen; k++) {
    const c1 = aligned1[k];
    const c2 = aligned2[k];
    if (c1 === '-' || c2 === '-') {
      gaps++;
      consensus += ' ';
    } else if (c1 === c2) {
      matches++;
      consensus += '|';
    } else {
      mismatches++;
      consensus += '.';
    }
  }

  const identityPercentage = totalLen > 0 ? Number(((matches / totalLen) * 100).toFixed(2)) : 0;
  const similarityPercentage = totalLen > 0 ? Number((((matches + (type === 'PROTEIN' ? Math.round(mismatches * 0.3) : 0)) / totalLen) * 100).toFixed(2)) : 0;

  return {
    type,
    refSeqName: refName,
    querySeqName: queryName,
    alignedRef: aligned1,
    alignedQuery: aligned2,
    consensus,
    score: dp[m][n],
    matches,
    mismatches,
    gaps,
    identityPercentage,
    similarityPercentage,
    length: totalLen,
  };
}
