import React from 'react';
import { useBio } from '../../context/BioContext';
import {
  Dna,
  PieChart as PieIcon,
  BarChart2,
  AlertTriangle,
  Flame,
  Scale,
  Hash,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const DnaAnalysisPage: React.FC = () => {
  const { activeSequence, dnaAnalysis, setActiveTab } = useBio();

  if (!activeSequence) {
    return (
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-8 text-center text-[#49343D] shadow-sm">
        <Dna className="w-12 h-12 text-[#D4AF72] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#49343D]">No Sequence Loaded</h3>
        <p className="text-xs text-[#49343D]/70 mt-1">
          Please select or search for a DNA sequence from the Sequence Search module first.
        </p>
        <button
          onClick={() => setActiveTab('search')}
          className="mt-4 px-4 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          Go to Sequence Search &rarr;
        </button>
      </div>
    );
  }

  if (activeSequence.type !== 'DNA' || !dnaAnalysis) {
    return (
      <div className="bg-[#F8E1E7]/50 border border-[#E8BFCB] rounded-2xl p-6 text-[#49343D] shadow-sm">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-[#D4AF72] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-[#49343D]">
              Protein Sequence Active: {activeSequence.name}
            </h3>
            <p className="text-xs text-[#49343D]/70 mt-1 leading-relaxed">
              DNA analysis calculates nucleotide properties (A, T, G, C) and is not applicable to amino acid polypeptide sequences.
              Please switch to a DNA sequence, or open the Protein Analysis module.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setActiveTab('protein-analysis')}
                className="px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                Go to Protein Analysis &rarr;
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className="px-3.5 py-2 bg-white border border-[#E8BFCB] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-xl transition"
              >
                Search DNA Sequences &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Dna className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">DNA Sequence Analytics & Composition</h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Detailed nucleotide distribution, GC/AT ratios, sequence validation, molecular weight, and melting temperature (<span className="font-mono">T_m</span>) calculations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-[#49343D]">{activeSequence.name}</span>
          <span className="font-mono text-[#D4AF72]">({activeSequence.accession})</span>
          <span className="px-2 py-0.5 rounded bg-[#F8E1E7] border border-[#E8BFCB] text-[10px] font-semibold text-[#49343D]">
            {activeSequence.length} bp
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Sequence Length</span>
            <Hash className="w-3.5 h-3.5 text-[#D4AF72]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {dnaAnalysis.length} <span className="text-xs font-normal text-[#49343D]/60">bp</span>
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
            <span>Validated DNA</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>GC Content</span>
            <PieIcon className="w-3.5 h-3.5 text-[#D4AF72]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {dnaAnalysis.gcPercent}%
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            G+C: {dnaAnalysis.gCount + dnaAnalysis.cCount} bp
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>AT Content</span>
            <PieIcon className="w-3.5 h-3.5 text-[#E8BFCB]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {dnaAnalysis.atPercent}%
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            A+T: {dnaAnalysis.aCount + dnaAnalysis.tCount} bp
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Melting Temp (Tm)</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-700 mt-1 tabular-nums">
            {dnaAnalysis.meltingTempTm} &deg;C
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            Wallace / nearest-neighbor
          </div>
        </div>
      </div>

      {/* Nucleotide Frequency Table & Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table */}
        <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Nucleotide Frequency Distribution
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FFF9F7] text-[#49343D] font-semibold border-b border-[#E8BFCB]">
                <tr>
                  <th className="p-2.5">Base</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5 font-mono text-right">Count</th>
                  <th className="p-2.5 font-mono text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8BFCB]/50 font-mono text-[#49343D]">
                <tr className="hover:bg-[#F8E1E7]/20">
                  <td className="p-2.5 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF72]" />
                    Adenine (A)
                  </td>
                  <td className="p-2.5 font-sans text-xs text-[#49343D]/70">Purine</td>
                  <td className="p-2.5 text-right font-bold tabular-nums">{dnaAnalysis.aCount}</td>
                  <td className="p-2.5 text-right tabular-nums">
                    {((dnaAnalysis.aCount / dnaAnalysis.length) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="hover:bg-[#F8E1E7]/20">
                  <td className="p-2.5 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E8BFCB]" />
                    Thymine (T)
                  </td>
                  <td className="p-2.5 font-sans text-xs text-[#49343D]/70">Pyrimidine</td>
                  <td className="p-2.5 text-right font-bold tabular-nums">{dnaAnalysis.tCount}</td>
                  <td className="p-2.5 text-right tabular-nums">
                    {((dnaAnalysis.tCount / dnaAnalysis.length) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="hover:bg-[#F8E1E7]/20">
                  <td className="p-2.5 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#49343D]" />
                    Guanine (G)
                  </td>
                  <td className="p-2.5 font-sans text-xs text-[#49343D]/70">Purine</td>
                  <td className="p-2.5 text-right font-bold tabular-nums">{dnaAnalysis.gCount}</td>
                  <td className="p-2.5 text-right tabular-nums">
                    {((dnaAnalysis.gCount / dnaAnalysis.length) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="hover:bg-[#F8E1E7]/20">
                  <td className="p-2.5 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F8E1E7] border border-[#E8BFCB]" />
                    Cytosine (C)
                  </td>
                  <td className="p-2.5 font-sans text-xs text-[#49343D]/70">Pyrimidine</td>
                  <td className="p-2.5 text-right font-bold tabular-nums">{dnaAnalysis.cCount}</td>
                  <td className="p-2.5 text-right tabular-nums">
                    {((dnaAnalysis.cCount / dnaAnalysis.length) * 100).toFixed(1)}%
                  </td>
                </tr>
                {dnaAnalysis.otherCount > 0 && (
                  <tr className="hover:bg-[#F8E1E7]/20 text-rose-700">
                    <td className="p-2.5 font-bold">Ambiguous / Other (N)</td>
                    <td className="p-2.5 font-sans text-xs">Unresolved</td>
                    <td className="p-2.5 text-right font-bold tabular-nums">{dnaAnalysis.otherCount}</td>
                    <td className="p-2.5 text-right tabular-nums">
                      {((dnaAnalysis.otherCount / dnaAnalysis.length) * 100).toFixed(1)}%
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-[#E8BFCB]/50 flex items-center justify-between text-xs text-[#49343D]/70">
            <span>Molecular Weight: <strong className="text-[#49343D]">{dnaAnalysis.molecularWeight.toLocaleString()} g/mol</strong></span>
            <span>Ambiguous Characters: <strong className="text-[#49343D]">{dnaAnalysis.otherCount}</strong></span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D] mb-4">
              Base Frequency Proportions
            </h3>

            {/* Proportional Stacked Bar */}
            <div className="w-full h-8 rounded-xl overflow-hidden flex border border-[#E8BFCB] shadow-2xs">
              <div
                style={{ width: `${(dnaAnalysis.aCount / dnaAnalysis.length) * 100}%` }}
                className="bg-[#D4AF72] h-full transition-all"
                title={`Adenine: ${dnaAnalysis.aCount}`}
              />
              <div
                style={{ width: `${(dnaAnalysis.tCount / dnaAnalysis.length) * 100}%` }}
                className="bg-[#E8BFCB] h-full transition-all"
                title={`Thymine: ${dnaAnalysis.tCount}`}
              />
              <div
                style={{ width: `${(dnaAnalysis.gCount / dnaAnalysis.length) * 100}%` }}
                className="bg-[#49343D] h-full transition-all"
                title={`Guanine: ${dnaAnalysis.gCount}`}
              />
              <div
                style={{ width: `${(dnaAnalysis.cCount / dnaAnalysis.length) * 100}%` }}
                className="bg-[#F8E1E7] h-full transition-all"
                title={`Cytosine: ${dnaAnalysis.cCount}`}
              />
            </div>

            {/* Hydrogen Bonding Chemistry Comparison */}
            <div className="mt-6 space-y-3">
              <div className="p-3.5 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#49343D] font-medium">G &bull; C Pairs (3 Hydrogen Bonds):</span>
                  <span className="font-mono font-bold text-[#D4AF72]">{dnaAnalysis.gcPercent}%</span>
                </div>
                <div className="w-full bg-[#F8E1E7] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF72] rounded-full transition-all"
                    style={{ width: `${dnaAnalysis.gcPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#49343D] font-medium">A &bull; T Pairs (2 Hydrogen Bonds):</span>
                  <span className="font-mono font-bold text-[#49343D]">{dnaAnalysis.atPercent}%</span>
                </div>
                <div className="w-full bg-[#F8E1E7] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#49343D] rounded-full transition-all"
                    style={{ width: `${dnaAnalysis.atPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 pt-3 border-t border-[#E8BFCB]/50">
            <button
              onClick={() => setActiveTab('orf-analysis')}
              className="flex-1 py-2 px-3 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center space-x-1"
            >
              <span>Detect ORFs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('translation')}
              className="flex-1 py-2 px-3 bg-[#FFF9F7] hover:bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB] text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1"
            >
              <span>Translate DNA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
