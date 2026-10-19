import React, { useState, useMemo } from 'react';
import { useBio } from '../../context/BioContext';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Filter,
  Layers,
  Sparkles,
  Dna,
  ArrowRight,
} from 'lucide-react';

interface MotifPreset {
  name: string;
  pattern: string;
  type: 'DNA' | 'PROTEIN';
  description: string;
}

const PRESET_MOTIFS: MotifPreset[] = [
  // DNA Presets
  { name: 'TATA Box Core', pattern: 'TATAAA', type: 'DNA', description: 'Core promoter element located ~25-30 bp upstream of transcription start site' },
  { name: 'TATA Box Consensus (IUPAC)', pattern: 'TATAWAW', type: 'DNA', description: 'Degenerate TATA consensus where W = A or T' },
  { name: 'Start Codon', pattern: 'ATG', type: 'DNA', description: 'Canonical translation initiation codon' },
  { name: 'Polyadenylation Signal', pattern: 'AATAAA', type: 'DNA', description: 'Cleavage and polyadenylation signal in eukaryotic pre-mRNA' },
  { name: 'E-Box (bHLH binding)', pattern: 'CANNTG', type: 'DNA', description: 'Basic helix-loop-helix transcription factor binding motif (N = any base)' },
  { name: 'CpG Dinucleotide Hotspot', pattern: 'CG', type: 'DNA', description: 'Site of cytosine DNA methylation and epigenetic regulation' },
  { name: 'Kozak Consensus Region', pattern: 'RCCATGG', type: 'DNA', description: 'Ribosome translation initiation context (R = A or G)' },
  // Protein Presets
  { name: 'N-Glycosylation Site', pattern: 'N[^P][ST][^P]', type: 'PROTEIN', description: 'Asn-X-Ser/Thr consensus sequon for asparagine-linked glycosylation' },
  { name: 'C2H2 Zinc Finger Core', pattern: 'C.{2,4}C.{12}H.{3,5}H', type: 'PROTEIN', description: 'Classical DNA-binding zinc finger motif' },
  { name: 'Protein Kinase C Phosphorylation', pattern: '[ST].[RK]', type: 'PROTEIN', description: 'Target motif for Serine/Threonine-protein kinase C' },
  { name: 'RGD Cell Adhesion Motif', pattern: 'RGD', type: 'PROTEIN', description: 'Integrin-binding recognition sequence in extracellular matrix proteins' },
];

export const MotifSearchPage: React.FC = () => {
  const { activeSequence, setActiveTab, showToast } = useBio();

  const isDna = activeSequence?.type === 'DNA';
  const defaultPattern = isDna ? 'TATAAA' : 'N[^P][ST][^P]';

  const [motifQuery, setMotifQuery] = useState<string>(defaultPattern);
  const [useRegex, setUseRegex] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  if (!activeSequence) {
    return (
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-8 text-center text-[#49343D] shadow-sm">
        <Dna className="w-12 h-12 text-[#D4AF72] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#49343D]">No Sequence Loaded</h3>
        <p className="text-xs text-[#49343D]/70 mt-1">
          Please select or search for a sequence from the Sequence Search module first.
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

  // Convert IUPAC nucleotide degenerate code to regex
  const iupacToRegex = (pattern: string): string => {
    const table: Record<string, string> = {
      R: '[AG]',
      Y: '[CT]',
      S: '[GC]',
      W: '[AT]',
      K: '[GT]',
      M: '[AC]',
      B: '[CGT]',
      D: '[AGT]',
      H: '[ACT]',
      V: '[ACG]',
      N: '[ACGT]',
    };

    let result = '';
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i].toUpperCase();
      if (char === '[' || char === ']' || char === '^' || char === '.' || char === '{' || char === '}') {
        result += pattern[i];
      } else if (table[char]) {
        result += table[char];
      } else {
        result += char;
      }
    }
    return result;
  };

  // Find all matches with 1-based start and end coordinates
  const searchResults = useMemo(() => {
    if (!activeSequence || !motifQuery.trim()) {
      return { matches: [], error: null };
    }

    const seq = activeSequence.sequence.toUpperCase();
    const cleanPattern = motifQuery.trim();

    try {
      const regexPattern = useRegex ? iupacToRegex(cleanPattern) : cleanPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(regexPattern, 'gi');

      const matches: { start: number; stop: number; matchedText: string }[] = [];
      let match: RegExpExecArray | null;

      // Ensure regex doesn't loop infinitely on empty match
      let lastIndex = -1;
      while ((match = regex.exec(seq)) !== null) {
        if (regex.lastIndex === lastIndex) {
          regex.lastIndex++;
        }
        lastIndex = regex.lastIndex;

        const start = match.index + 1; // 1-based
        const stop = match.index + match[0].length;
        matches.push({
          start,
          stop,
          matchedText: match[0],
        });

        // Advance manually by 1 to allow overlapping motifs
        regex.lastIndex = match.index + 1;
      }

      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err?.message || 'Invalid motif regular expression syntax.' };
    }
  }, [activeSequence, motifQuery, useRegex]);

  const handleApplyPreset = (preset: MotifPreset) => {
    setSelectedPreset(preset.name);
    setMotifQuery(preset.pattern);
    showToast(`Loaded motif: ${preset.name} (${preset.pattern})`, 'info');
  };

  const handleDownloadCsv = () => {
    if (searchResults.matches.length === 0) return;
    const headers = ['Sequence Name', 'Accession', 'Motif Query', 'Match Index', 'Start Position (1-based)', 'Stop Position', 'Matched Subsequence'];
    const rows = searchResults.matches.map((m, idx) => [
      `"${activeSequence.name}"`,
      `"${activeSequence.accession}"`,
      `"${motifQuery}"`,
      idx + 1,
      m.start,
      m.stop,
      `"${m.matchedText}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSequence.name}_motif_${motifQuery.replace(/[^a-zA-Z0-9]/g, '_')}_matches.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${searchResults.matches.length} motif coordinates as CSV.`, 'success');
  };

  // Render sequence with visual highlights on matched coordinates
  const renderHighlightedTrack = () => {
    const seq = activeSequence.sequence;
    if (searchResults.matches.length === 0) {
      return <span>{seq}</span>;
    }

    // Build segments
    const elements: React.ReactNode[] = [];
    let cur = 0;

    // Sort matches by start position
    const sorted = [...searchResults.matches].sort((a, b) => a.start - b.start);

    sorted.forEach((m, idx) => {
      const matchStart = m.start - 1; // 0-based
      const matchEnd = m.stop; // 0-based exclusive

      if (matchStart > cur) {
        elements.push(
          <span key={`unmatched-${idx}`} className="text-[#49343D]/60">
            {seq.substring(cur, matchStart)}
          </span>
        );
      }

      if (matchEnd > cur) {
        const sliceStart = Math.max(cur, matchStart);
        elements.push(
          <mark
            key={`match-${idx}`}
            title={`Match #${idx + 1} (${m.start}..${m.stop}): ${m.matchedText}`}
            className="bg-[#D4AF72] text-white px-0.5 py-0.2 rounded font-bold transition-all hover:bg-[#49343D] cursor-pointer"
          >
            {seq.substring(sliceStart, matchEnd)}
          </mark>
        );
        cur = matchEnd;
      }
    });

    if (cur < seq.length) {
      elements.push(
        <span key="tail" className="text-[#49343D]/60">
          {seq.substring(cur)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">
              Biological Motif Search
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Search for regulatory elements, transcription factor binding sites, or peptide consensus signatures.
            Supports exact patterns, IUPAC degenerate codes (<span className="font-mono">R, Y, S, W, N</span>), and regular expressions.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleDownloadCsv}
            disabled={searchResults.matches.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Matches (.csv)</span>
          </button>
        </div>
      </div>

      {/* Target & Preset Selection */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8BFCB]/50">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-[#49343D]">Target Sequence:</span>
            <span className="font-bold text-[#49343D]">{activeSequence.name}</span>
            <span className="text-xs font-mono text-[#D4AF72]">({activeSequence.accession})</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F8E1E7] text-[10px] font-semibold text-[#49343D]">
              {activeSequence.type} ({activeSequence.length} {activeSequence.type === 'DNA' ? 'bp' : 'aa'})
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <label className="flex items-center space-x-1.5 text-[#49343D] cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={e => setUseRegex(e.target.checked)}
                className="accent-[#D4AF72] rounded cursor-pointer"
              />
              <span>Enable IUPAC / RegEx Matching</span>
            </label>
          </div>
        </div>

        {/* Motif Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3" />
            <input
              type="text"
              value={motifQuery}
              onChange={e => setMotifQuery(e.target.value)}
              placeholder={isDna ? 'Enter DNA motif (e.g. TATAAA, TATAWAW, ATG)...' : 'Enter protein motif (e.g. RGD, N[^P][ST][^P])...'}
              className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
            />
          </div>
        </div>

        {searchResults.error && (
          <div className="p-3 bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl flex items-start space-x-2 text-xs text-[#49343D]">
            <AlertCircle className="w-4 h-4 text-[#D4AF72] shrink-0 mt-0.5" />
            <span>{searchResults.error}</span>
          </div>
        )}

        {/* Presets Chips */}
        <div>
          <div className="text-[11px] font-bold text-[#49343D]/60 uppercase tracking-wider mb-2">
            Curated Presets for {activeSequence.type}:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_MOTIFS.filter(p => p.type === activeSequence.type).map(preset => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  motifQuery === preset.pattern
                    ? 'bg-[#D4AF72] text-white border-[#D4AF72] font-semibold'
                    : 'bg-[#FFF9F7] border-[#E8BFCB] text-[#49343D] hover:bg-[#F8E1E7]'
                }`}
                title={preset.description}
              >
                {preset.name} <span className="font-mono text-[10px] opacity-80">({preset.pattern})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Total Matches Found
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {searchResults.matches.length}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Occurrences in sequence
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Motif Density
          </div>
          <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {activeSequence.length > 0
              ? `${((searchResults.matches.length / activeSequence.length) * 1000).toFixed(1)} /kb`
              : '0 /kb'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            Per 1,000 base pairs
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            First Occurrence
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {searchResults.matches.length > 0 ? `Pos ${searchResults.matches[0].start}` : 'None'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            1-based start coordinate
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/60">
            Last Occurrence
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {searchResults.matches.length > 0
              ? `Pos ${searchResults.matches[searchResults.matches.length - 1].start}`
              : 'None'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-0.5">
            1-based start coordinate
          </div>
        </div>
      </div>

      {/* Visual Sequence Track with Highlighted Motifs */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8BFCB]/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Sequence Visual Coordinate Highlighter
          </h3>
          <span className="text-xs text-[#49343D]/60">
            Gold marks indicate exact matched occurrences
          </span>
        </div>

        <div className="p-4 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl font-mono text-xs leading-relaxed break-all max-h-56 overflow-y-auto">
          {renderHighlightedTrack()}
        </div>
      </div>

      {/* Matching Coordinates Table */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8BFCB] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            Matching Coordinates & Subsequences ({searchResults.matches.length})
          </h3>
          <span className="text-xs text-[#49343D]/60">1-based genomic coordinates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF9F7] text-[#49343D] font-semibold border-b border-[#E8BFCB]">
              <tr>
                <th className="p-3">Match #</th>
                <th className="p-3">Start Position</th>
                <th className="p-3">Stop Position</th>
                <th className="p-3">Matched Substring</th>
                <th className="p-3">Length</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8BFCB]/50 text-[#49343D]">
              {searchResults.matches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[#49343D]/60">
                    No occurrences of motif "{motifQuery}" found in {activeSequence.name}.
                  </td>
                </tr>
              ) : (
                searchResults.matches.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#F8E1E7]/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#49343D]">#{idx + 1}</td>
                    <td className="p-3 font-mono tabular-nums font-semibold text-[#D4AF72]">
                      Pos {m.start}
                    </td>
                    <td className="p-3 font-mono tabular-nums text-[#49343D]/80">
                      Pos {m.stop}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#49343D]">
                      {m.matchedText}
                    </td>
                    <td className="p-3 font-mono tabular-nums">{m.matchedText.length} {activeSequence.type === 'DNA' ? 'bp' : 'aa'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${m.start}..${m.stop}: ${m.matchedText}`);
                          showToast(`Copied coordinate ${m.start}..${m.stop}`, 'success');
                        }}
                        className="px-2.5 py-1 rounded bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs transition"
                      >
                        Copy Coordinate
                      </button>
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
