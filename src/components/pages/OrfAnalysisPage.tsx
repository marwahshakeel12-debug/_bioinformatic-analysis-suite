import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import { OrfResult } from '../../types/bio';
import {
  Microscope,
  CheckCircle2,
  Filter,
  Download,
  Copy,
  ArrowRight,
  Info,
  Layers,
  Dna,
} from 'lucide-react';

export const OrfAnalysisPage: React.FC = () => {
  const {
    activeSequence,
    orfs,
    selectedOrf,
    setSelectedOrf,
    setActiveTab,
    showToast,
  } = useBio();

  const [frameFilter, setFrameFilter] = useState<string>('ALL');
  const [minLen, setMinLen] = useState<number>(30);
  const [viewingOrf, setViewingOrf] = useState<OrfResult | null>(null);

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

  if (activeSequence.type !== 'DNA') {
    return (
      <div className="bg-[#F8E1E7]/50 border border-[#E8BFCB] rounded-2xl p-6 text-[#49343D] shadow-sm">
        <h3 className="text-sm font-bold text-[#49343D]">
          Protein Sequence Active: {activeSequence.name}
        </h3>
        <p className="text-xs text-[#49343D]/70 mt-1 leading-relaxed">
          Open Reading Frame (ORF) detection operates specifically on nucleotide DNA sequences across all six reading frames.
          Please switch to a DNA sequence to perform ORF detection.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setActiveTab('search')}
            className="px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            Search DNA Sequences &rarr;
          </button>
          <button
            onClick={() => setActiveTab('protein-analysis')}
            className="px-3.5 py-2 bg-white border border-[#E8BFCB] hover:bg-[#F8E1E7]/40 text-[#49343D] text-xs font-semibold rounded-xl transition"
          >
            Go to Protein Analysis &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Filter ORFs by frame and minimum length
  const filteredOrfs = orfs.filter(
    orf => (frameFilter === 'ALL' || orf.frame === frameFilter) && orf.length >= minLen
  );

  const longestOrf = orfs.length > 0 ? orfs[0] : null;

  const downloadOrfsFasta = () => {
    if (filteredOrfs.length === 0) return;
    const fastaLines = filteredOrfs.map(
      orf => `>ORF_${orf.id} Frame=${orf.frame} Range=${orf.start}..${orf.stop} Length=${orf.length}bp\n${orf.dnaSequence.match(/.{1,60}/g)?.join('\n') || orf.dnaSequence}`
    );
    const blob = new Blob([fastaLines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSequence.name}_detected_ORFs.fasta`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filteredOrfs.length} ORFs in FASTA format.`, 'success');
  };

  const copyOrfFasta = (orf: OrfResult) => {
    const text = `>ORF_${orf.id} Frame=${orf.frame} Range=${orf.start}..${orf.stop} Length=${orf.length}bp Translated=${orf.translatedProtein.length}aa\n${orf.translatedProtein}`;
    navigator.clipboard.writeText(text);
    showToast(`Copied translated ORF #${orf.id} to clipboard!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Microscope className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">
              Open Reading Frame (ORF) Analysis
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Identifies protein-coding open reading frames across all six reading frames (+1, +2, +3 forward strand; -1, -2, -3 reverse complement).
            Detects canonical start codons (ATG) and termination codons (TAA, TAG, TGA).
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={downloadOrfsFasta}
            disabled={filteredOrfs.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ORFs (.fasta)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Total ORFs Found
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {orfs.length}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Across 6 reading frames
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Longest ORF
          </div>
          <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {longestOrf ? `${longestOrf.length} bp` : '0 bp'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            {longestOrf ? `${Math.floor(longestOrf.length / 3)} amino acids` : 'None'}
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Primary Coding Frame
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1">
            {longestOrf ? longestOrf.frame : 'N/A'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            {longestOrf?.frame.startsWith('+') ? 'Forward strand' : 'Reverse strand'}
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Active Selected ORF
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1">
            {selectedOrf ? `#${selectedOrf.id}` : '#1 (Default)'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Passed to downstream tools
          </div>
        </div>
      </div>

      {/* Visual Reading Frames Schematic */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8BFCB]/50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
              6-Frame Spatial Distribution Map
            </h3>
            <p className="text-[11px] text-[#49343D]/70 mt-0.5">
              Position of detected coding sequences relative to sequence length ({activeSequence.length} bp)
            </p>
          </div>
          <span className="text-xs font-mono text-[#D4AF72] font-semibold">
            {filteredOrfs.length} frames plotted
          </span>
        </div>

        <div className="space-y-2 pt-1 font-mono text-[11px]">
          {['+1', '+2', '+3', '-1', '-2', '-3'].map(frame => {
            const frameOrfs = orfs.filter(o => o.frame === frame);
            const isForward = frame.startsWith('+');
            return (
              <div key={frame} className="flex items-center space-x-3">
                <span className={`w-8 font-bold ${isForward ? 'text-[#D4AF72]' : 'text-[#49343D]'}`}>
                  {frame}
                </span>
                <div className="flex-1 h-6 bg-[#FFF9F7] border border-[#E8BFCB] rounded relative overflow-hidden">
                  {frameOrfs.map(o => {
                    const leftPct = (o.start / activeSequence.length) * 100;
                    const widthPct = Math.max(1.5, (o.length / activeSequence.length) * 100);
                    const isSelected = selectedOrf?.id === o.id;
                    return (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrf(o)}
                        title={`ORF #${o.id} (${o.frame}): ${o.start}..${o.stop} (${o.length} bp)`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        className={`absolute top-0 bottom-0 cursor-pointer transition-colors rounded-sm ${
                          isSelected
                            ? 'bg-[#D4AF72] border border-[#49343D]'
                            : isForward
                            ? 'bg-[#E8BFCB] hover:bg-[#D4AF72]'
                            : 'bg-[#49343D]/30 hover:bg-[#49343D]/60'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="w-12 text-right text-[#49343D]/60 text-[10px]">
                  {frameOrfs.length} ORFs
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span className="font-semibold text-[#49343D]">Filter Frame:</span>
            <select
              value={frameFilter}
              onChange={e => setFrameFilter(e.target.value)}
              className="bg-white border border-[#E8BFCB] text-[#49343D] text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Frames (6)</option>
              <option value="+1">Frame +1 (Forward)</option>
              <option value="+2">Frame +2 (Forward)</option>
              <option value="+3">Frame +3 (Forward)</option>
              <option value="-1">Frame -1 (Reverse)</option>
              <option value="-2">Frame -2 (Reverse)</option>
              <option value="-3">Frame -3 (Reverse)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#49343D]">Min Length:</span>
            <input
              type="range"
              min="30"
              max="240"
              step="15"
              value={minLen}
              onChange={e => setMinLen(Number(e.target.value))}
              className="accent-[#D4AF72] cursor-pointer"
            />
            <span className="font-mono text-xs text-[#D4AF72] font-bold">{minLen} bp</span>
          </div>
        </div>

        <div className="text-xs text-[#49343D]/70">
          Showing <span className="font-bold text-[#49343D]">{filteredOrfs.length}</span> of {orfs.length} detected ORFs
        </div>
      </div>

      {/* ORFs Table */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8BFCB] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Identified Open Reading Frames
          </h3>
          <span className="text-xs text-[#49343D]/60">
            Click [SELECT] to set as active translation sequence
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF9F7] text-[#49343D] font-semibold border-b border-[#E8BFCB]">
              <tr>
                <th className="p-3">ORF ID</th>
                <th className="p-3">Reading Frame</th>
                <th className="p-3">Start (bp)</th>
                <th className="p-3">Stop (bp)</th>
                <th className="p-3">Length (bp)</th>
                <th className="p-3">Peptide Length</th>
                <th className="p-3">Translated Protein Preview</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8BFCB]/50 text-[#49343D]">
              {filteredOrfs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-[#49343D]/60">
                    No open reading frames match the selected length/frame filter.
                  </td>
                </tr>
              ) : (
                filteredOrfs.map(orf => {
                  const isSelected = selectedOrf?.id === orf.id;
                  return (
                    <tr
                      key={orf.id}
                      className={`hover:bg-[#F8E1E7]/30 transition-colors ${
                        isSelected ? 'bg-[#F8E1E7]/60 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-[#49343D]">
                        #{orf.id}
                        {orf.isLongest && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-[#D4AF72]/20 text-[#49343D] font-semibold border border-[#D4AF72]/40">
                            Longest
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#D4AF72]">
                        {orf.frame}
                      </td>
                      <td className="p-3 font-mono tabular-nums">{orf.start}</td>
                      <td className="p-3 font-mono tabular-nums">{orf.stop}</td>
                      <td className="p-3 font-mono tabular-nums font-semibold">{orf.length} bp</td>
                      <td className="p-3 font-mono tabular-nums">{orf.translatedProtein.length} aa</td>
                      <td className="p-3 font-mono text-[11px] text-[#49343D]/80 max-w-xs truncate" title={orf.translatedProtein}>
                        {orf.translatedProtein}
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => copyOrfFasta(orf)}
                          className="px-2.5 py-1 rounded bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs transition"
                          title="Copy translated peptide"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setViewingOrf(orf)}
                          className="px-2.5 py-1 rounded bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs transition"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrf(orf);
                            showToast(`Selected ORF #${orf.id} (${orf.frame}) as active sequence.`, 'success');
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-[#49343D] text-white'
                              : 'bg-[#D4AF72] hover:bg-[#c49e62] text-white shadow-sm'
                          }`}
                        >
                          {isSelected ? '✓ In Use' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {viewingOrf && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8BFCB] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl p-6">
            <div className="pb-3 border-b border-[#E8BFCB] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#49343D]">
                  ORF #{viewingOrf.id} Details (Frame {viewingOrf.frame})
                </h3>
                <p className="text-xs text-[#49343D]/70">
                  Coordinates: {viewingOrf.start}..{viewingOrf.stop} ({viewingOrf.length} bp &bull; {viewingOrf.translatedProtein.length} amino acids)
                </p>
              </div>
              <button
                onClick={() => setViewingOrf(null)}
                className="px-3 py-1 bg-[#FFF9F7] hover:bg-[#F8E1E7] text-[#49343D] text-xs font-semibold rounded-lg border border-[#E8BFCB]"
              >
                Close
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
              <div>
                <div className="font-sans font-bold text-xs text-[#49343D] mb-1">
                  DNA Coding Sequence ({viewingOrf.length} bp):
                </div>
                <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl text-[#49343D] break-all leading-relaxed">
                  {viewingOrf.dnaSequence}
                </div>
              </div>

              <div>
                <div className="font-sans font-bold text-xs text-[#49343D] mb-1">
                  Translated Amino Acid Product ({viewingOrf.translatedProtein.length} aa):
                </div>
                <div className="p-3 bg-[#F8E1E7]/50 border border-[#E8BFCB] rounded-xl text-[#49343D] break-all leading-relaxed font-bold">
                  {viewingOrf.translatedProtein}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8BFCB] flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedOrf(viewingOrf);
                  setViewingOrf(null);
                  setActiveTab('translation');
                }}
                className="px-4 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
              >
                Use in Translation Module &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
