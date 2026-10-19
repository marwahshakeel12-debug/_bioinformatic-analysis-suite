import React, { useState, useMemo } from 'react';
import { useBio } from '../../context/BioContext';
import {
  Search,
  Dna,
  Binary,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  detectBiologicalInputType,
  SearchFilterType,
} from '../../utils/ncbiService';

export const HomePage: React.FC = () => {
  const {
    activeSequence,
    setActiveTab,
    executeSearch,
    searchFilter,
    setSearchFilter,
    searchQuery,
    setSearchQuery,
  } = useBio();

  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [localFilter, setLocalFilter] = useState<SearchFilterType>(searchFilter || 'AUTO');

  // Real-time input type detection
  const detected = useMemo(() => {
    return detectBiologicalInputType(localQuery);
  }, [localQuery]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) {
      return;
    }
    setSearchQuery(localQuery.trim());
    setSearchFilter(localFilter);
    setActiveTab('search');
    await executeSearch(localQuery.trim(), localFilter);
  };

  const handleSelectQuickExample = async (exampleQuery: string, filter: SearchFilterType = 'AUTO') => {
    setLocalQuery(exampleQuery);
    setLocalFilter(filter);
    setSearchQuery(exampleQuery);
    setSearchFilter(filter);
    setActiveTab('search');
    await executeSearch(exampleQuery, filter);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 sm:px-6 py-10 max-w-4xl mx-auto">
      {/* Brand & Welcoming Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#F8E1E7] border border-[#E8BFCB] rounded-full text-xs font-semibold text-[#49343D] shadow-2xs">
          <Dna className="w-4 h-4 text-[#D4AF72]" />
          <span>Bioinformatics Analysis Suite (BAS)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#49343D] tracking-tight">
          Welcome to Bioinformatics Analysis Suite
        </h1>

        <p className="text-sm sm:text-base text-[#49343D]/75 max-w-xl mx-auto leading-relaxed">
          Integrated Platform for Biological Sequence Analysis
        </p>
      </div>

      {/* Main Search Bar Card */}
      <div className="w-full bg-white border border-[#E8BFCB] rounded-3xl p-4 sm:p-6 shadow-md transition-shadow hover:shadow-lg">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* Main Input Row */}
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#D4AF72] absolute left-4 top-3.5 sm:top-4 pointer-events-none" />
              <input
                type="text"
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                placeholder="Search a gene, DNA sequence, protein, or accession ID..."
                className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-2xl pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF72] transition"
                autoFocus
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => setLocalQuery('')}
                  className="absolute right-3.5 top-3.5 sm:top-4 text-xs font-semibold text-[#49343D]/50 hover:text-[#49343D]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Clear Primary Search Button */}
            <button
              type="submit"
              className="px-6 py-3 sm:py-3.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold text-sm rounded-2xl shadow-sm transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Filter Selector & Input Auto-Detection Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#E8BFCB]/40">
            {/* Optional Filter Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[#49343D]/70 font-medium">Search Type:</span>
              <div className="inline-flex bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl p-1 gap-1">
                {(
                  [
                    { id: 'AUTO', label: 'Auto-detect' },
                    { id: 'GENE', label: 'Gene' },
                    { id: 'DNA', label: 'DNA' },
                    { id: 'PROTEIN', label: 'Protein' },
                  ] as const
                ).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLocalFilter(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      localFilter === item.id
                        ? 'bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB] shadow-2xs'
                        : 'text-[#49343D]/70 hover:text-[#49343D]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Input Auto-Detection Feedback */}
            {localQuery.trim() ? (
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#49343D]/60 font-medium">Input Identified:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB] font-semibold flex items-center gap-1">
                  {detected.type === 'DNA' ? (
                    <Dna className="w-3 h-3 text-[#D4AF72]" />
                  ) : detected.type === 'PROTEIN' ? (
                    <Binary className="w-3 h-3 text-[#D4AF72]" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-[#D4AF72]" />
                  )}
                  <span>{detected.label}</span>
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-[#49343D]/60 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#D4AF72]" />
                <span>Accepts gene names, NCBI accessions, UniProt IDs, or raw sequences</span>
              </div>
            )}
          </div>
        </form>

        {/* Minimal Unobtrusive Quick Query Hints */}
        <div className="mt-4 pt-3 border-t border-[#E8BFCB]/40 flex items-center justify-between text-xs text-[#49343D]/60">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span>Try searching:</span>
            {[
              { label: 'BRCA1', query: 'BRCA1', filter: 'DNA' as SearchFilterType },
              { label: 'TP53', query: 'TP53', filter: 'DNA' as SearchFilterType },
              { label: 'EGFR', query: 'EGFR', filter: 'DNA' as SearchFilterType },
              { label: 'P01308 (Insulin)', query: 'P01308', filter: 'PROTEIN' as SearchFilterType },
            ].map((item, idx) => (
              <span key={idx} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => handleSelectQuickExample(item.query, item.filter)}
                  className="text-[#D4AF72] hover:text-[#b8955b] underline font-medium cursor-pointer"
                >
                  {item.label}
                </button>
                {idx < 3 && <span className="ml-1.5 text-[#E8BFCB]">&bull;</span>}
              </span>
            ))}
          </div>
          <span className="text-[10px] hidden sm:inline text-[#49343D]/50">Press Enter to search</span>
        </div>
      </div>

      {/* Active Sequence Workspace Jump Banner (if sequence is already loaded) */}
      {activeSequence && (
        <div className="w-full mt-6 bg-white border border-[#E8BFCB] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#F8E1E7] border border-[#E8BFCB] flex items-center justify-center text-[#D4AF72] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF72]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#49343D] truncate">{activeSequence.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB] font-semibold">
                  {activeSequence.type} &bull; {activeSequence.length} {activeSequence.type === 'DNA' ? 'bp' : 'aa'}
                </span>
                <span className="text-[10px] font-mono text-[#49343D]/60 hidden md:inline">
                  {activeSequence.accession}
                </span>
              </div>
              <p className="text-xs text-[#49343D]/70 truncate mt-0.5">
                {activeSequence.description || activeSequence.organism}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('analysis-workspace')}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition shadow-2xs shrink-0 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Open Analysis Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
