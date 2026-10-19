import React from 'react';
import { useBio } from '../context/BioContext';
import { Dna, FileText, PanelLeftOpen, PanelLeftClose, Layers } from 'lucide-react';
import { CURATED_DATABASE_RECORDS } from '../utils/ncbiService';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeSequence,
    setActiveSequence,
    sidebarCollapsed,
    toggleSidebar,
  } = useBio();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Home';
      case 'search':
        return 'Search Results';
      case 'analysis-workspace':
      case 'analysis-tools':
        return 'Analysis Workspace';
      case 'dna-analysis':
        return 'DNA Analysis';
      case 'orf-analysis':
      case 'orf-motif':
        return 'ORF Analysis';
      case 'translation':
        return 'DNA-to-Protein Translation';
      case 'protein-analysis':
        return 'Protein Analysis';
      case 'motif-search':
        return 'Motif Search';
      case 'alignment':
        return 'Sequence Alignment';
      case 'mutation':
        return 'Mutation Analysis';
      case 'vcf':
        return 'VCF Generator';
      case 'machine-learning':
        return 'Machine Learning';
      case 'population-map':
        return 'Population Map';
      case 'visualization':
        return 'Visualization';
      case 'reports':
        return 'Reports';
      case 'architecture-docs':
        return 'Architecture and Documentation';
      case 'settings':
        return 'Settings / Theme';
      default:
        return 'Bioinformatics Analysis Suite';
    }
  };

  return (
    <header className="h-16 border-b border-[#E8BFCB] bg-white px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 shadow-2xs">
      <div className="flex items-center space-x-2.5 text-xs">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] transition cursor-pointer md:hidden"
          title="Toggle Navigation Sidebar"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-[#D4AF72]" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-[#D4AF72]" />
          )}
        </button>

        <span className="text-[#49343D]/60 font-medium">BAS</span>
        <span className="text-[#E8BFCB]">&bull;</span>
        <h1 className="text-sm font-bold text-[#49343D] tracking-tight">
          {getTabTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Sequence Switcher */}
        {activeSequence && (
          <div className="flex items-center bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl px-2.5 py-1 text-xs space-x-2 shadow-2xs">
            <Dna className="w-3.5 h-3.5 text-[#D4AF72] shrink-0" />
            <span className="text-[#49343D]/70 text-[11px] hidden sm:inline font-medium">
              Active:
            </span>
            <select
              value={activeSequence?.accession || ''}
              onChange={e => {
                const found = CURATED_DATABASE_RECORDS.find(r => r.accession === e.target.value);
                if (found) setActiveSequence(found);
              }}
              className="bg-transparent text-[#49343D] font-medium text-xs focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none truncate"
            >
              {CURATED_DATABASE_RECORDS.map(rec => (
                <option key={rec.accession} value={rec.accession} className="bg-white text-[#49343D]">
                  {rec.name} ({rec.type}) - {rec.accession}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Workspace Button */}
        {activeTab !== 'analysis-workspace' && (
          <button
            onClick={() => setActiveTab('analysis-workspace')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] transition shadow-2xs cursor-pointer"
            title="Open Analysis Workspace"
          >
            <Layers className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Workspace</span>
          </button>
        )}

        {/* Quick Report Button */}
        <button
          onClick={() => setActiveTab('reports')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#D4AF72] hover:bg-[#c49e62] text-white shadow-sm transition shrink-0 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>
    </header>
  );
};
