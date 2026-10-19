import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import {
  BarChart3,
  PieChart as PieIcon,
  Activity,
  GitCompare,
  GitBranch,
  BrainCircuit,
  Binary,
  Layers,
} from 'lucide-react';

export const VisualizationPage: React.FC = () => {
  const {
    activeSequence,
    dnaAnalysis,
    proteinAnalysis,
    alignmentResult,
    mutationVariants,
    mlMetrics,
  } = useBio();

  const [activeVizTab, setActiveVizTab] = useState<
    'NUCLEOTIDES' | 'GC_SKEW' | 'ALIGNMENT' | 'MUTATIONS' | 'ML_CONFUSION'
  >('NUCLEOTIDES');

  // Compute GC-skew sliding window (window size 25 bp)
  const computeGcSkewWindows = () => {
    if (!activeSequence || activeSequence.type !== 'DNA') return [];
    const seq = activeSequence.sequence;
    const windowSize = 25;
    const step = 15;
    const windows: { pos: number; gcSkew: number; gcPercent: number }[] = [];

    for (let i = 0; i + windowSize <= seq.length; i += step) {
      const chunk = seq.substring(i, i + windowSize);
      let g = 0, c = 0;
      for (const char of chunk) {
        if (char === 'G') g++;
        else if (char === 'C') c++;
      }
      // GC Skew = (G - C) / (G + C)
      const skew = g + c > 0 ? Number(((g - c) / (g + c)).toFixed(2)) : 0;
      const gcPct = Number((((g + c) / windowSize) * 100).toFixed(1));
      windows.push({ pos: i + 1, gcSkew: skew, gcPercent: gcPct });
    }
    return windows;
  };

  const gcSkewData = computeGcSkewWindows();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]">
              Biological Graphics
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#49343D]">Biological Visualizations Suite</h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Visual representations across nucleotide frequencies, sliding-window GC-skew, alignment match tracks, mutation distribution, and ML validation.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-[#FFF9F7] p-1.5 rounded-xl border border-[#E8BFCB]">
          <button
            onClick={() => setActiveVizTab('NUCLEOTIDES')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeVizTab === 'NUCLEOTIDES'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Nucleotides
          </button>
          <button
            onClick={() => setActiveVizTab('GC_SKEW')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeVizTab === 'GC_SKEW'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            GC Skew
          </button>
          <button
            onClick={() => setActiveVizTab('ALIGNMENT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeVizTab === 'ALIGNMENT'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Alignment
          </button>
          <button
            onClick={() => setActiveVizTab('MUTATIONS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeVizTab === 'MUTATIONS'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Mutations
          </button>
          <button
            onClick={() => setActiveVizTab('ML_CONFUSION')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeVizTab === 'ML_CONFUSION'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            ML Matrix
          </button>
        </div>
      </div>

      {/* VIEW 1: Nucleotide Distribution Charts */}
      {activeVizTab === 'NUCLEOTIDES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart Representation */}
            <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D4AF72]" />
                Nucleotide Frequency Bar Chart
              </h3>

              <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-4 px-6 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                {dnaAnalysis?.nucleotideComposition.map(base => {
                  const barHeight = Math.max(14, base.percentage * 2.2);
                  return (
                    <div key={base.base} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-mono font-bold text-[#49343D] mb-2">
                        {base.count} ({base.percentage}%)
                      </span>
                      <div
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor:
                            base.base.startsWith('A') ? '#D4AF72' :
                            base.base.startsWith('T') ? '#E8BFCB' :
                            base.base.startsWith('G') ? '#49343D' : '#c49e62',
                        }}
                        className="w-full max-w-[48px] rounded-t-lg transition-all group-hover:opacity-90 shadow-sm"
                      />
                      <span className="text-xs font-bold text-[#49343D] mt-2 font-mono">
                        {base.base.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proportional Polar / Donut Concept */}
            <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#D4AF72]" />
                  Base Pairs & Chemistry Breakdown
                </h3>

                <div className="space-y-3 mt-4">
                  <div className="p-3.5 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#49343D]/70 font-semibold">GC Pairs (3 Hydrogen Bonds):</span>
                      <span className="font-mono font-bold text-[#D4AF72]">
                        {dnaAnalysis ? `${dnaAnalysis.gcPercent}%` : '-'}
                      </span>
                    </div>
                    <div className="w-full bg-[#F8E1E7] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF72] rounded-full transition-all"
                        style={{ width: `${dnaAnalysis?.gcPercent || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#49343D]/70 font-semibold">AT Pairs (2 Hydrogen Bonds):</span>
                      <span className="font-mono font-bold text-[#49343D]">
                        {dnaAnalysis ? `${dnaAnalysis.atPercent}%` : '-'}
                      </span>
                    </div>
                    <div className="w-full bg-[#F8E1E7] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E8BFCB] rounded-full transition-all"
                        style={{ width: `${dnaAnalysis?.atPercent || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] text-xs text-[#49343D]/70 mt-4 leading-relaxed">
                Higher GC content confers increased thermodynamic stability due to triple hydrogen bonding and base-stacking interactions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Sliding Window GC Skew Chart */}
      {activeVizTab === 'GC_SKEW' && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#D4AF72]" />
                Sliding Window GC-Skew & GC% Trajectory
              </h3>
              <p className="text-xs text-[#49343D]/70 mt-0.5">
                Formula: (G - C) / (G + C) across 25 bp overlapping sliding windows
              </p>
            </div>
            <span className="text-xs text-[#49343D]/70 font-medium">{gcSkewData.length} Windows Analyzed</span>
          </div>

          <div className="h-64 bg-[#FFF9F7] p-4 rounded-xl border border-[#E8BFCB] flex items-end gap-1.5 overflow-x-auto">
            {gcSkewData.map((w, idx) => {
              const height = Math.max(10, Math.min(180, (w.gcPercent / 100) * 200));
              return (
                <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-[#49343D] mb-1 whitespace-nowrap">
                    {w.gcPercent}%
                  </div>
                  <div
                    style={{ height: `${height}px` }}
                    className={`w-full rounded-t transition-all group-hover:opacity-80 ${
                      w.gcSkew >= 0 ? 'bg-[#D4AF72]' : 'bg-[#E8BFCB]'
                    }`}
                    title={`Window @ Pos ${w.pos}: GC=${w.gcPercent}%, Skew=${w.gcSkew}`}
                  />
                  <div className="text-[8px] font-mono text-[#49343D]/60 mt-1 truncate max-w-full">
                    {w.pos}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Alignment Viewer */}
      {activeVizTab === 'ALIGNMENT' && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-3 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#D4AF72]" />
            Global Dynamic Programming Identity Distribution
          </h3>
          {alignmentResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                  <span className="text-[#49343D]/70 font-semibold">Total Matches:</span>
                  <div className="text-xl font-bold text-emerald-800 mt-1">{alignmentResult.matches}</div>
                </div>
                <div className="p-3 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                  <span className="text-[#49343D]/70 font-semibold">Substitutions:</span>
                  <div className="text-xl font-bold text-[#D4AF72] mt-1">{alignmentResult.mismatches}</div>
                </div>
                <div className="p-3 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                  <span className="text-[#49343D]/70 font-semibold">Indels / Gaps:</span>
                  <div className="text-xl font-bold text-rose-800 mt-1">{alignmentResult.gaps}</div>
                </div>
              </div>

              {/* Identity Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#49343D]/70 font-semibold">Global Sequence Identity:</span>
                  <span className="font-mono font-bold text-[#D4AF72]">
                    {alignmentResult.identityPercentage}%
                  </span>
                </div>
                <div className="w-full bg-[#F8E1E7] h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF72] rounded-full transition-all"
                    style={{ width: `${alignmentResult.identityPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#49343D]/70 text-xs">No alignment calculated yet.</div>
          )}
        </div>
      )}

      {/* VIEW 4: Mutations Map */}
      {activeVizTab === 'MUTATIONS' && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#D4AF72]" />
            Genomic Mutation Density Along Sequence
          </h3>
          <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
            <div className="text-xs text-[#49343D]/70 mb-3 font-semibold">Variant density per position:</div>
            <div className="flex flex-wrap gap-2">
              {mutationVariants.map(v => (
                <div
                  key={v.id}
                  className="px-3 py-2 bg-white border border-[#E8BFCB] rounded-xl text-xs shadow-2xs"
                >
                  <div className="font-bold text-[#49343D]">Pos {v.position}</div>
                  <div className="font-mono text-[#D4AF72] font-semibold mt-0.5">{v.reference} &rarr; {v.query}</div>
                  <div className="text-[10px] text-[#49343D]/70 mt-0.5">{v.mutationType}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: ML Matrix */}
      {activeVizTab === 'ML_CONFUSION' && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#D4AF72]" />
            Machine Learning Confusion Heatmap
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-center font-mono">
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
              <div className="text-xs text-emerald-800 font-bold uppercase">True Positive (TP)</div>
              <div className="text-3xl font-bold text-emerald-900 mt-2">
                {mlMetrics?.confusionMatrix.tp || 5}
              </div>
            </div>
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl shadow-xs">
              <div className="text-xs text-rose-800 font-bold uppercase">False Positive (FP)</div>
              <div className="text-3xl font-bold text-rose-900 mt-2">
                {mlMetrics?.confusionMatrix.fp || 0}
              </div>
            </div>
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl shadow-xs">
              <div className="text-xs text-rose-800 font-bold uppercase">False Negative (FN)</div>
              <div className="text-3xl font-bold text-rose-900 mt-2">
                {mlMetrics?.confusionMatrix.fn || 0}
              </div>
            </div>
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
              <div className="text-xs text-emerald-800 font-bold uppercase">True Negative (TN)</div>
              <div className="text-3xl font-bold text-emerald-900 mt-2">
                {mlMetrics?.confusionMatrix.tn || 5}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
