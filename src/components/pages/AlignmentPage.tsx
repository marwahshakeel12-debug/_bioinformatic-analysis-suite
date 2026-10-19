import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import {
  GitCompare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Hash,
  Scale,
  RefreshCw,
  Dna,
} from 'lucide-react';

export const AlignmentPage: React.FC = () => {
  const {
    activeSequence,
    alignmentResult,
    runPairwiseAlignment,
    setActiveTab,
    showToast,
  } = useBio();

  const [alignType, setAlignType] = useState<'DNA' | 'PROTEIN'>('DNA');
  const [refName, setRefName] = useState(
    activeSequence ? `${activeSequence.name} (Ref)` : 'Wild-Type Reference'
  );
  const [queryName, setQueryName] = useState('Patient / Query Variant');

  const [refInput, setRefInput] = useState(activeSequence?.sequence || '');
  const [queryInput, setQueryInput] = useState(() => {
    // Generate sample variant sequence by introducing point mutations
    if (!activeSequence?.sequence) return '';
    const chars = activeSequence.sequence.split('');
    if (chars.length > 15) chars[14] = chars[14] === 'A' ? 'G' : chars[14] === 'C' ? 'T' : 'A';
    if (chars.length > 45) chars[44] = chars[44] === 'T' ? 'C' : 'G';
    if (chars.length > 80) chars.splice(79, 2); // 2 bp deletion
    return chars.join('');
  });

  const [isComputing, setIsComputing] = useState(false);

  const handleAlign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim() || !queryInput.trim()) {
      showToast('Both Reference and Query sequences are required.', 'error');
      return;
    }
    setIsComputing(true);
    setTimeout(() => {
      runPairwiseAlignment(queryInput.trim(), alignType, queryName);
      setIsComputing(false);
    }, 100);
  };

  const loadActiveSequenceAsRef = () => {
    if (activeSequence) {
      setRefInput(activeSequence.sequence);
      setRefName(`${activeSequence.name} (${activeSequence.accession})`);
      setAlignType(activeSequence.type === 'DNA' ? 'DNA' : 'PROTEIN');
      showToast(`Loaded "${activeSequence.name}" as alignment reference.`, 'info');
    }
  };

  // Helper to chunk alignment representation into readable blocks of 60 characters
  const renderAlignmentChunks = () => {
    if (!alignmentResult) return null;
    const { alignedRef, alignedQuery, consensus } = alignmentResult;
    const chunkSize = 60;
    const chunks = [];

    for (let i = 0; i < alignedRef.length; i += chunkSize) {
      const refChunk = alignedRef.substring(i, i + chunkSize);
      const queryChunk = alignedQuery.substring(i, i + chunkSize);
      const conChunk = consensus.substring(i, i + chunkSize);
      const startCoord = i + 1;
      const endCoord = Math.min(i + chunkSize, alignedRef.length);

      chunks.push({ refChunk, queryChunk, conChunk, startCoord, endCoord });
    }

    return (
      <div className="space-y-4 font-mono text-xs overflow-x-auto">
        {chunks.map((c, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl space-y-1"
          >
            <div className="text-[10px] text-[#49343D]/60 flex justify-between font-sans">
              <span>Coordinates: {c.startCoord} &ndash; {c.endCoord}</span>
              <span>Block #{idx + 1}</span>
            </div>

            {/* Reference */}
            <div className="flex items-center space-x-2">
              <span className="w-16 font-semibold text-[#49343D] text-[11px] truncate">
                Ref:
              </span>
              <span className="tracking-wider text-[#49343D] break-all">{c.refChunk}</span>
            </div>

            {/* Consensus / Match Line */}
            <div className="flex items-center space-x-2">
              <span className="w-16 font-semibold text-transparent text-[11px]">.</span>
              <span className="tracking-wider font-bold text-[#D4AF72] break-all select-none">
                {c.conChunk}
              </span>
            </div>

            {/* Query */}
            <div className="flex items-center space-x-2">
              <span className="w-16 font-semibold text-[#D4AF72] text-[11px] truncate">
                Query:
              </span>
              <span className="tracking-wider text-[#49343D] font-bold break-all">
                {c.queryChunk}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">
              Pairwise Sequence Alignment
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Needleman-Wunsch global dynamic programming alignment. Calculates optimal match scores, identity percentage, and gap insertions.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={loadActiveSequenceAsRef}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Load Active Sequence</span>
          </button>
        </div>
      </div>

      {/* Input Parameters Form */}
      <form onSubmit={handleAlign} className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8BFCB]/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Alignment Inputs & Matrix Configuration
          </h3>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-[#49343D]">Sequence Type:</span>
            <select
              value={alignType}
              onChange={e => setAlignType(e.target.value as any)}
              className="bg-[#FFF9F7] border border-[#E8BFCB] text-[#49343D] text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="DNA">DNA (Match +2, Mismatch -1, Gap -2)</option>
              <option value="PROTEIN">Protein (BLOSUM62 Metric)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#49343D]">
                Reference Sequence: <span className="font-mono text-[#D4AF72]">{refName}</span>
              </label>
              <span className="font-mono text-[11px] text-[#49343D]/60">{refInput.length} characters</span>
            </div>
            <textarea
              rows={4}
              required
              value={refInput}
              onChange={e => setRefInput(e.target.value.toUpperCase())}
              placeholder="Paste wild-type reference sequence..."
              className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl p-3 text-xs font-mono text-[#49343D] focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
            />
          </div>

          {/* Query Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#49343D]">
                Query Sequence: <span className="font-mono text-[#D4AF72]">{queryName}</span>
              </label>
              <span className="font-mono text-[11px] text-[#49343D]/60">{queryInput.length} characters</span>
            </div>
            <textarea
              rows={4}
              required
              value={queryInput}
              onChange={e => setQueryInput(e.target.value.toUpperCase())}
              placeholder="Paste patient/variant query sequence to align..."
              className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl p-3 text-xs font-mono text-[#49343D] focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isComputing}
            className="px-6 py-2.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
          >
            <span>{isComputing ? 'Computing Needleman-Wunsch Matrix...' : 'Run Sequence Alignment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Alignment Statistics Strip */}
      {alignmentResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
                Sequence Identity
              </div>
              <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
                {alignmentResult.identityPercentage}%
              </div>
              <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                Exact matching positions
              </div>
            </div>

            <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
                Alignment Score
              </div>
              <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
                {alignmentResult.score}
              </div>
              <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                Optimal DP traceback
              </div>
            </div>

            <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
                Matches (|)
              </div>
              <div className="text-2xl font-mono font-bold text-emerald-700 mt-1 tabular-nums">
                {alignmentResult.matches}
              </div>
              <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                Consensus identity
              </div>
            </div>

            <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
                Mismatches (:)
              </div>
              <div className="text-2xl font-mono font-bold text-amber-700 mt-1 tabular-nums">
                {alignmentResult.mismatches}
              </div>
              <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                Substitutions called
              </div>
            </div>

            <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
                Gaps / Indels (-)
              </div>
              <div className="text-2xl font-mono font-bold text-rose-700 mt-1 tabular-nums">
                {alignmentResult.gaps}
              </div>
              <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                Insertions & deletions
              </div>
            </div>
          </div>

          {/* Visual Alignment Track View */}
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8BFCB]/50">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
                  Dynamic Programming Traceback Visualization
                </h3>
                <p className="text-[11px] text-[#49343D]/60 mt-0.5">
                  Consensus Legend: <strong className="text-[#D4AF72]">|</strong> = Match, <strong className="text-amber-700">:</strong> = Mismatch, <strong className="text-rose-700">space</strong> = Gap
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('mutation')}
                  className="px-3.5 py-1.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center space-x-1"
                >
                  <span>Call Mutations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {renderAlignmentChunks()}
          </div>
        </div>
      )}
    </div>
  );
};
