import React from 'react';
import { useBio } from '../../context/BioContext';
import {
  GitBranch,
  ArrowRight,
  FileCode2,
  CheckCircle2,
  Activity,
  Globe,
  Dna,
} from 'lucide-react';

export const MutationPage: React.FC = () => {
  const {
    activeSequence,
    alignmentResult,
    mutationVariants,
    setActiveTab,
  } = useBio();

  if (!alignmentResult) {
    return (
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-8 text-center text-[#49343D] shadow-sm">
        <GitBranch className="w-12 h-12 text-[#D4AF72] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#49343D]">No Alignment Completed Yet</h3>
        <p className="text-xs text-[#49343D]/70 mt-1">
          Mutation calling compares aligned reference and query sequences from the Sequence Alignment module.
        </p>
        <button
          onClick={() => setActiveTab('alignment')}
          className="mt-4 px-4 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          Perform Pairwise Alignment &rarr;
        </button>
      </div>
    );
  }

  const substitutions = mutationVariants.filter(m => m.mutationType === 'Substitution');
  const insertions = mutationVariants.filter(m => m.mutationType === 'Insertion');
  const deletions = mutationVariants.filter(m => m.mutationType === 'Deletion');
  const refLength = activeSequence?.length || 100;

  return (
    <div className="space-y-6">
      {/* Overview Context Card */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">
              Mutation Analysis & Variant Calling
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Identifies single nucleotide variants (SNVs), transitions/transversions, in-frame and frameshift indels, and assesses coding impact on amino acid translation.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('vcf')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Generate VCF File</span>
          </button>
          <button
            onClick={() => setActiveTab('population-map')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Population Frequencies</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Total Variant Calls
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {mutationVariants.length}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Identified along alignment
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Substitutions (SNVs)
          </div>
          <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {substitutions.length}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Point base mutations
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Insertions
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {insertions.length}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Novel nucleotide gains
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Deletions
          </div>
          <div className="text-2xl font-mono font-bold text-rose-700 mt-1 tabular-nums">
            {deletions.length}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Nucleotide loss events
          </div>
        </div>
      </div>

      {/* Spatial Mutation Density Map */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8BFCB]/50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
              Genomic Mutation Locus Track
            </h3>
            <p className="text-[11px] text-[#49343D]/60 mt-0.5">
              Variant positions distributed along reference sequence length ({refLength} bp)
            </p>
          </div>
          <span className="text-xs font-mono text-[#D4AF72] font-semibold">
            {mutationVariants.length} variants plotted
          </span>
        </div>

        <div className="relative w-full h-12 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl flex items-center px-2 overflow-hidden">
          <div className="absolute inset-x-0 h-0.5 bg-[#E8BFCB]" />
          {mutationVariants.map(m => {
            const leftPct = Math.min(98, Math.max(2, (m.position / refLength) * 100));
            return (
              <div
                key={m.id}
                style={{ left: `${leftPct}%` }}
                className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                title={`Pos ${m.position}: ${m.reference} -> ${m.query} (${m.mutationType})`}
              >
                <div className="w-3 h-3 rounded-full bg-[#D4AF72] border-2 border-white shadow-xs group-hover:scale-125 transition-transform" />
                <span className="text-[9px] font-mono font-bold text-[#49343D] mt-0.5">
                  {m.position}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Mutation Table */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8BFCB] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Variant Calls & Functional Impact ({mutationVariants.length})
          </h3>
          <span className="text-xs text-[#49343D]/60">1-based reference coordinates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF9F7] text-[#49343D] font-semibold border-b border-[#E8BFCB]">
              <tr>
                <th className="p-3">Variant ID</th>
                <th className="p-3">Position</th>
                <th className="p-3 font-mono">Reference</th>
                <th className="p-3 font-mono">Query (Alt)</th>
                <th className="p-3">Type</th>
                <th className="p-3">Subtype</th>
                <th className="p-3">Codon Change</th>
                <th className="p-3">Peptide Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8BFCB]/50 text-[#49343D]">
              {mutationVariants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-[#49343D]/60">
                    No mutations or variants detected between reference and query.
                  </td>
                </tr>
              ) : (
                mutationVariants.map(v => (
                  <tr key={v.id} className="hover:bg-[#F8E1E7]/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#49343D]">{v.id}</td>
                    <td className="p-3 font-mono font-bold text-[#D4AF72] tabular-nums">
                      Pos {v.position}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#49343D]">{v.reference}</td>
                    <td className="p-3 font-mono font-bold text-[#D4AF72]">{v.query}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFF9F7] border border-[#E8BFCB] text-[#49343D]">
                        {v.mutationType}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-[#49343D]/80">{v.subtype || '-'}</td>
                    <td className="p-3 font-mono text-[11px]">
                      {v.codonRef && v.codonQuery ? `${v.codonRef} → ${v.codonQuery}` : '-'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          v.impact === 'Missense'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : v.impact === 'Nonsense'
                            ? 'bg-rose-50 text-rose-900 border border-rose-200'
                            : v.impact === 'Synonymous'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-[#FFF9F7] text-[#49343D] border border-[#E8BFCB]'
                        }`}
                      >
                        {v.impact || 'Non-coding'}
                        {v.aaRef && v.aaQuery && ` (${v.aaRef}→${v.aaQuery})`}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
