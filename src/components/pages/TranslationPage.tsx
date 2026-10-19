import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import { translateDna, CODON_TABLE } from '../../utils/orfAndTranslation';
import {
  ArrowRightLeft,
  Copy,
  Download,
  CheckCircle2,
  FileText,
  ArrowRight,
  Filter,
  Dna,
} from 'lucide-react';

export const TranslationPage: React.FC = () => {
  const {
    activeSequence,
    selectedOrf,
    showToast,
    setActiveTab,
  } = useBio();

  const [translationSource, setTranslationSource] = useState<'SELECTED_ORF' | 'FULL_SEQUENCE'>(
    selectedOrf ? 'SELECTED_ORF' : 'FULL_SEQUENCE'
  );
  const [frameOffset, setFrameOffset] = useState<number>(0);
  const [stopAtAsterisk, setStopAtAsterisk] = useState<boolean>(true);

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

  // Compute translation based on selected options
  const targetDna =
    translationSource === 'SELECTED_ORF' && selectedOrf
      ? selectedOrf.dnaSequence
      : activeSequence.sequence;

  const { protein: activeProtein, codons } = translateDna(
    targetDna,
    translationSource === 'SELECTED_ORF' ? 0 : frameOffset,
    stopAtAsterisk
  );

  const copyProtein = () => {
    navigator.clipboard.writeText(activeProtein);
    showToast('Protein amino acid sequence copied to clipboard!', 'success');
  };

  const downloadProteinFasta = () => {
    const header = `>Translated_${activeSequence.name}_${
      translationSource === 'SELECTED_ORF' && selectedOrf ? `ORF_${selectedOrf.id}` : `Frame_${frameOffset + 1}`
    } length=${activeProtein.length}aa`;
    const wrapped = activeProtein.match(/.{1,60}/g)?.join('\n') || activeProtein;
    const fastaContent = `${header}\n${wrapped}`;

    const blob = new Blob([fastaContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSequence.name}_translated_protein.fasta`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded translated protein in FASTA format (${activeProtein.length} aa).`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">
              DNA-to-Protein Translation
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Translates nucleotide triplets into amino acid polypeptide sequences using the Standard Genetic Code codon matrix.
            Supports reading frame shifting, open reading frame selection, and FASTA protein export.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={copyProtein}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition"
          >
            <Copy className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Copy Sequence</span>
          </button>
          <button
            onClick={downloadProteinFasta}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download FASTA</span>
          </button>
        </div>
      </div>

      {/* Translation Settings & Parameters */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8BFCB]/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Translation Source & Frame Controls
          </h3>
          <div className="text-xs text-[#49343D]/60 font-mono">
            Input: {targetDna.length} nucleotides &bull; Output: {activeProtein.length} amino acids
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Source Toggle */}
          <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-[#49343D]/70 uppercase tracking-wider">
              Source Sequence
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTranslationSource('FULL_SEQUENCE')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                  translationSource === 'FULL_SEQUENCE'
                    ? 'bg-[#D4AF72] text-white border-[#D4AF72]'
                    : 'bg-white text-[#49343D] border-[#E8BFCB]'
                }`}
              >
                Full DNA ({activeSequence.length} bp)
              </button>
              <button
                type="button"
                disabled={!selectedOrf}
                onClick={() => setTranslationSource('SELECTED_ORF')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                  translationSource === 'SELECTED_ORF'
                    ? 'bg-[#D4AF72] text-white border-[#D4AF72]'
                    : 'bg-white text-[#49343D] border-[#E8BFCB] disabled:opacity-40'
                }`}
              >
                Selected ORF {selectedOrf ? `(#${selectedOrf.id})` : '(None)'}
              </button>
            </div>
          </div>

          {/* Frame Offset */}
          <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-[#49343D]/70 uppercase tracking-wider">
              Reading Frame Offset
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(offset => (
                <button
                  key={offset}
                  disabled={translationSource === 'SELECTED_ORF'}
                  onClick={() => setFrameOffset(offset)}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                    frameOffset === offset && translationSource !== 'SELECTED_ORF'
                      ? 'bg-[#49343D] text-white border-[#49343D]'
                      : 'bg-white text-[#49343D] border-[#E8BFCB] disabled:opacity-40'
                  }`}
                >
                  +{offset + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Stop Option */}
          <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#49343D]/70 uppercase tracking-wider">
                Stop Codon Handling
              </div>
              <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                {stopAtAsterisk ? 'Truncate at first stop (*)' : 'Translate through with *'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stopAtAsterisk}
                onChange={e => setStopAtAsterisk(e.target.checked)}
                className="accent-[#D4AF72] w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Translated Protein Output Container */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8BFCB]/50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
              Translated Amino Acid Sequence ({activeProtein.length} aa)
            </h3>
            <p className="text-[11px] text-[#49343D]/60 mt-0.5">
              Standard IUPAC single-letter peptide code
            </p>
          </div>

          <button
            onClick={() => setActiveTab('protein-analysis')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition"
          >
            <span>Analyze Protein Properties</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF72]" />
          </button>
        </div>

        <div className="p-4 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl font-mono text-xs text-[#49343D] font-bold leading-relaxed break-all max-h-56 overflow-y-auto">
          {activeProtein || 'No translated peptide.'}
        </div>
      </div>

      {/* Codon-by-Codon Alignment Grid */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8BFCB]/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Codon Triplet Breakdown ({codons.length} codons)
          </h3>
          <span className="text-xs text-[#49343D]/60 font-mono">
            Triplet &rarr; Amino Acid
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-72 overflow-y-auto pt-1 font-mono text-xs">
          {codons.map((c, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-center transition ${
                c.aa === '*'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : c.aa === 'M'
                  ? 'bg-[#F8E1E7] border-[#E8BFCB] text-[#49343D] font-bold'
                  : 'bg-[#FFF9F7] border-[#E8BFCB] text-[#49343D]'
              }`}
              title={`Position ${idx + 1}: ${c.codon} -> ${c.aa}`}
            >
              <div className="text-[10px] text-[#49343D]/60 font-medium">{c.codon}</div>
              <div className="text-base font-bold mt-0.5">{c.aa}</div>
              <div className="text-[9px] text-[#49343D]/50 mt-0.5">{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
