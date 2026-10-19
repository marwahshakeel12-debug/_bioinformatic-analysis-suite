import React from 'react';
import { useBio } from '../../context/BioContext';
import {
  Binary,
  Scale,
  Zap,
  Droplets,
  Activity,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const ProteinAnalysisPage: React.FC = () => {
  const { activeSequence, proteinAnalysis, setActiveTab } = useBio();

  if (!proteinAnalysis) {
    return (
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-8 text-center text-[#49343D] shadow-sm">
        <Binary className="w-12 h-12 text-[#D4AF72] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#49343D]">No Protein Data Available</h3>
        <p className="text-xs text-[#49343D]/70 mt-1">
          Select a protein sequence from Search, or translate a DNA sequence / ORF first.
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

  const isTranslated = activeSequence?.type === 'DNA';

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]">
              {activeSequence?.accession || 'POLYPEPTIDE'}
            </span>
            <h2 className="text-base font-bold text-[#49343D]">
              {activeSequence ? `${activeSequence.name} ${isTranslated ? '(Translated Product)' : ''}` : 'Protein'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF9F7] border border-[#E8BFCB] text-[#49343D]/80">
              {activeSequence?.organism || 'Homo sapiens'}
            </span>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            {isTranslated
              ? 'Analyzing the translated peptide product derived from active DNA reading frame.'
              : activeSequence?.description}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-[#49343D]">Length:</span>
          <span className="font-mono font-bold text-[#D4AF72]">{proteinAnalysis.length} aa</span>
        </div>
      </div>

      {/* Primary Physicochemical Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Mol Weight</span>
            <Scale className="w-3.5 h-3.5 text-[#D4AF72]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {(proteinAnalysis.molecularWeight / 1000).toFixed(2)}
            <span className="text-xs font-normal text-[#49343D]/60 ml-1">kDa</span>
          </div>
          <div className="text-[10px] text-[#49343D]/70 mt-0.5 font-mono">
            {proteinAnalysis.molecularWeight.toLocaleString()} Da
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Isoelectric Point</span>
            <Zap className="w-3.5 h-3.5 text-[#D4AF72]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {proteinAnalysis.isoelectricPoint.toFixed(2)}
          </div>
          <div className="text-[10px] text-[#49343D]/70 mt-0.5">
            {proteinAnalysis.isoelectricPoint < 7 ? 'Acidic pI' : 'Basic pI'}
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Net Charge</span>
            <Activity className="w-3.5 h-3.5 text-[#49343D]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {proteinAnalysis.chargeAtPh74 > 0 ? `+${proteinAnalysis.chargeAtPh74.toFixed(2)}` : proteinAnalysis.chargeAtPh74.toFixed(2)}
          </div>
          <div className="text-[10px] text-[#49343D]/70 mt-0.5">
            At pH 7.4
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>GRAVY Index</span>
            <Droplets className="w-3.5 h-3.5 text-[#D4AF72]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {proteinAnalysis.gravy.toFixed(2)}
          </div>
          <div className="text-[10px] text-[#49343D]/70 mt-0.5">
            {proteinAnalysis.gravy < 0 ? 'Hydrophilic' : 'Hydrophobic'}
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Extinction Coeff</span>
            <Activity className="w-3.5 h-3.5 text-[#E8BFCB]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {proteinAnalysis.extinctionCoefficient.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#49343D]/70 mt-0.5">
            M&minus;&sup1; cm&minus;&sup1; (280nm)
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60 flex items-center justify-between">
            <span>Aliphatic Index</span>
            <Zap className="w-3.5 h-3.5 text-[#D4AF72]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {proteinAnalysis.aliphaticIndex.toFixed(1)}
          </div>
          <div className="text-[10px] text-[#49343D]/70 mt-0.5">
            Thermostability
          </div>
        </div>
      </div>

      {/* 20 Amino Acids Composition Breakdown */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8BFCB] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Amino Acid Residue Composition ({proteinAnalysis.composition.length} Residues)
          </h3>
          <span className="text-xs text-[#49343D]/60">
            Categorized by chemical properties
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF9F7] text-[#49343D] font-semibold border-b border-[#E8BFCB]">
              <tr>
                <th className="p-3">Amino Acid</th>
                <th className="p-3">1-Letter</th>
                <th className="p-3">3-Letter</th>
                <th className="p-3">Chemical Classification</th>
                <th className="p-3 font-mono text-right">Residue Count</th>
                <th className="p-3 font-mono text-right">Percentage</th>
                <th className="p-3">Visual Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8BFCB]/50 text-[#49343D]">
              {proteinAnalysis.composition.map(aa => (
                <tr key={aa.singleLetter} className="hover:bg-[#F8E1E7]/20 transition-colors">
                  <td className="p-3 font-semibold text-[#49343D]">{aa.aminoAcid}</td>
                  <td className="p-3 font-mono font-bold text-[#D4AF72]">{aa.singleLetter}</td>
                  <td className="p-3 font-mono text-[#49343D]/80">{aa.threeLetter}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        aa.category === 'Nonpolar'
                          ? 'bg-[#FFF9F7] text-[#49343D] border border-[#E8BFCB]'
                          : aa.category === 'Polar'
                          ? 'bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]'
                          : aa.category === 'Basic'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : aa.category === 'Acidic'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {aa.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono tabular-nums text-right font-bold text-[#49343D]">
                    {aa.count}
                  </td>
                  <td className="p-3 font-mono tabular-nums text-right text-[#D4AF72] font-semibold">
                    {aa.percentage}%
                  </td>
                  <td className="p-3 w-40">
                    <div className="w-full bg-[#FFF9F7] border border-[#E8BFCB] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF72] rounded-full"
                        style={{ width: `${Math.min(100, aa.percentage * 5)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
