import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import {
  Dna,
  Binary,
  Microscope,
  ArrowRightLeft,
  GitCompare,
  GitBranch,
  FileCode2,
  BrainCircuit,
  BarChart3,
  FileText,
  Search,
  Globe,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatFasta, downloadFastaFile } from '../../utils/ncbiService';

// Import all existing working analysis modules
import { DnaAnalysisPage } from './DnaAnalysisPage';
import { OrfAnalysisPage } from './OrfAnalysisPage';
import { TranslationPage } from './TranslationPage';
import { ProteinAnalysisPage } from './ProteinAnalysisPage';
import { MotifSearchPage } from './MotifSearchPage';
import { AlignmentPage } from './AlignmentPage';
import { MutationPage } from './MutationPage';
import { VcfPage } from './VcfPage';
import { MachineLearningPage } from './MachineLearningPage';
import { PopulationMapPage } from './PopulationMapPage';
import { VisualizationPage } from './VisualizationPage';
import { ReportPage } from './ReportPage';

export type WorkspaceTabId =
  | 'overview'
  | 'dna-analysis'
  | 'orf-analysis'
  | 'translation'
  | 'protein-analysis'
  | 'motif-search'
  | 'alignment'
  | 'mutation'
  | 'vcf'
  | 'machine-learning'
  | 'population-map'
  | 'visualization'
  | 'reports';

interface WorkspaceTabDef {
  id: WorkspaceTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  appliesTo: 'ALL' | 'DNA' | 'PROTEIN';
}

const WORKSPACE_TABS: WorkspaceTabDef[] = [
  { id: 'overview', label: 'Overview', icon: Layers, appliesTo: 'ALL' },
  { id: 'dna-analysis', label: 'DNA Analysis', icon: Dna, appliesTo: 'DNA' },
  { id: 'orf-analysis', label: 'ORF Analysis', icon: Microscope, appliesTo: 'DNA' },
  { id: 'translation', label: 'DNA-to-Protein Translation', icon: ArrowRightLeft, appliesTo: 'DNA' },
  { id: 'protein-analysis', label: 'Protein Analysis', icon: Binary, appliesTo: 'ALL' },
  { id: 'motif-search', label: 'Motif Search', icon: Search, appliesTo: 'ALL' },
  { id: 'alignment', label: 'Sequence Alignment', icon: GitCompare, appliesTo: 'ALL' },
  { id: 'mutation', label: 'Mutation Analysis', icon: GitBranch, appliesTo: 'ALL' },
  { id: 'vcf', label: 'VCF Generator', icon: FileCode2, appliesTo: 'DNA' },
  { id: 'machine-learning', label: 'Machine Learning', icon: BrainCircuit, appliesTo: 'DNA' },
  { id: 'population-map', label: 'Population Map', icon: Globe, appliesTo: 'ALL' },
  { id: 'visualization', label: 'Visualization', icon: BarChart3, appliesTo: 'ALL' },
  { id: 'reports', label: 'Reports', icon: FileText, appliesTo: 'ALL' },
];

export const AnalysisWorkspacePage: React.FC = () => {
  const {
    activeSequence,
    setActiveTab,
    analysisWorkspaceSubTab,
    setAnalysisWorkspaceSubTab,
    dnaAnalysis,
    proteinAnalysis,
    orfs,
    mutationVariants,
    mlPrediction,
    showToast,
  } = useBio();

  const currentTab = (analysisWorkspaceSubTab as WorkspaceTabId) || 'overview';

  if (!activeSequence) {
    return (
      <div className="bg-white border border-[#E8BFCB] rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-4 my-10">
        <div className="w-16 h-16 rounded-2xl bg-[#F8E1E7] border border-[#E8BFCB] flex items-center justify-center mx-auto text-[#D4AF72]">
          <Dna className="w-8 h-8 text-[#D4AF72]" />
        </div>
        <h2 className="text-xl font-bold text-[#49343D]">No Sequence Selected for Analysis</h2>
        <p className="text-xs text-[#49343D]/70 max-w-md mx-auto leading-relaxed">
          Please search for a biological record (gene, accession, or sequence) to open the interactive analysis workspace.
        </p>
        <button
          onClick={() => setActiveTab('search')}
          className="px-6 py-2.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition inline-flex items-center space-x-2 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Search Biological Databases</span>
        </button>
      </div>
    );
  }

  const isDna = activeSequence.type === 'DNA';

  // Only display tabs relevant to the selected record
  const visibleTabs = WORKSPACE_TABS.filter(tab => {
    if (isDna) return true;
    return tab.appliesTo === 'ALL' || tab.appliesTo === 'PROTEIN';
  });

  const activeTabValid = visibleTabs.some(t => t.id === currentTab);
  const effectiveTab: WorkspaceTabId = activeTabValid ? currentTab : 'overview';

  const copySequence = () => {
    navigator.clipboard.writeText(activeSequence.sequence);
    showToast(`Copied ${activeSequence.type} sequence to clipboard!`, 'success');
  };

  const downloadFasta = () => {
    downloadFastaFile(activeSequence);
    showToast(`Downloaded FASTA file for ${activeSequence.name}`, 'success');
  };

  const renderActiveToolContent = () => {
    switch (effectiveTab) {
      case 'overview':
        return renderOverview();
      case 'dna-analysis':
        return <DnaAnalysisPage />;
      case 'orf-analysis':
        return <OrfAnalysisPage />;
      case 'translation':
        return <TranslationPage />;
      case 'protein-analysis':
        return <ProteinAnalysisPage />;
      case 'motif-search':
        return <MotifSearchPage />;
      case 'alignment':
        return <AlignmentPage />;
      case 'mutation':
        return <MutationPage />;
      case 'vcf':
        return <VcfPage />;
      case 'machine-learning':
        return <MachineLearningPage />;
      case 'population-map':
        return <PopulationMapPage />;
      case 'visualization':
        return <VisualizationPage />;
      case 'reports':
        return <ReportPage />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        {/* Quick Diagnostics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-[#49343D]/60">Sequence Length</div>
            <div className="text-2xl font-bold text-[#49343D] mt-1 font-mono">
              {activeSequence.length}{' '}
              <span className="text-xs font-normal text-[#49343D]/70">{isDna ? 'bp' : 'aa'}</span>
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">
              {isDna ? 'Nucleotides' : 'Amino Acids'}
            </div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-[#49343D]/60">
              {isDna ? 'GC Content' : 'Molecular Weight'}
            </div>
            <div className="text-2xl font-bold text-[#D4AF72] mt-1 font-mono">
              {isDna
                ? `${dnaAnalysis?.gcPercent || 0}%`
                : proteinAnalysis?.molecularWeight
                ? `${proteinAnalysis.molecularWeight.toLocaleString()} Da`
                : '0 Da'}
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">
              {isDna ? `AT: ${dnaAnalysis?.atPercent || 0}%` : `pI: ${proteinAnalysis?.isoelectricPoint || 0}`}
            </div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-[#49343D]/60">
              {isDna ? 'Open Reading Frames' : 'Net Charge (pH 7.4)'}
            </div>
            <div className="text-2xl font-bold text-[#49343D] mt-1 font-mono">
              {isDna
                ? orfs.length
                : proteinAnalysis?.chargeAtPh74 !== undefined
                ? proteinAnalysis.chargeAtPh74 > 0
                  ? `+${proteinAnalysis.chargeAtPh74}`
                  : `${proteinAnalysis.chargeAtPh74}`
                : 0}
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">
              {isDna ? '6-frame detected' : 'Coulombic sum'}
            </div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-[#49343D]/60">
              {isDna ? 'ML Promoter Probability' : 'Hydropathy (GRAVY)'}
            </div>
            <div className="text-2xl font-bold text-[#D4AF72] mt-1 font-mono">
              {isDna
                ? `${((mlPrediction?.probability || 0.88) * 100).toFixed(0)}%`
                : (proteinAnalysis?.gravy || 0)}
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">
              {isDna ? mlPrediction?.classification || 'Promoter' : 'Kyte-Doolittle'}
            </div>
          </div>
        </div>

        {/* Sequence Viewer Card */}
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D] flex items-center gap-1.5">
              <Dna className="w-4 h-4 text-[#D4AF72]" />
              <span>Full Sequence Stream</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copySequence}
                className="px-3 py-1 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-xs font-medium text-[#49343D] transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <button
                onClick={downloadFasta}
                className="px-3 py-1 bg-[#D4AF72] hover:bg-[#c49e62] text-white rounded-xl text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download FASTA</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] max-h-48 overflow-y-auto whitespace-pre-wrap break-all leading-relaxed scrollbar-thin scrollbar-thumb-[#E8BFCB]">
            {activeSequence.sequence}
          </pre>
        </div>

        {/* Quick Launchpad to Tools */}
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
              Recommended Analysis Workflows for this {activeSequence.type}
            </h3>
            <span className="text-xs text-[#49343D]/60">Select any tool to run</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {isDna ? (
              <>
                <button
                  onClick={() => setAnalysisWorkspaceSubTab('dna-analysis')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>DNA Analysis</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Base counts, GC%, melting temperature
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('orf-analysis')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <Microscope className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>ORF Analysis</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      6-frame open reading frame detection
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('translation')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Translation</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Standard genetic code codon table
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('alignment')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <GitCompare className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Sequence Alignment</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Needleman-Wunsch global alignment
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('vcf')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>VCF Generator</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Standard VCF v4.2 format output
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('machine-learning')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Machine Learning</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Random Forest promoter prediction
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAnalysisWorkspaceSubTab('protein-analysis')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <Binary className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Protein Analysis</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Isoelectric point, hydropathy, residues
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('motif-search')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Motif Search</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      N-glycosylation & kinase recognition
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>

                <button
                  onClick={() => setAnalysisWorkspaceSubTab('reports')}
                  className="p-3.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl text-left transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#49343D] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Generate Report</span>
                    </div>
                    <div className="text-[11px] text-[#49343D]/70 mt-0.5">
                      Publication PDF & HTML export
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#49343D]/50 group-hover:text-[#D4AF72] transition" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selected Record Header Card */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]">
                Active Sequence
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isDna
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                {activeSequence.type} &bull; {activeSequence.length} {isDna ? 'bp' : 'aa'}
              </span>
              <span className="text-xs font-mono font-semibold text-[#D4AF72]">
                {activeSequence.accession}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#49343D] tracking-tight truncate">
              {activeSequence.name}
            </h2>

            <p className="text-xs text-[#49343D]/75 line-clamp-1 mt-0.5">
              {activeSequence.description || activeSequence.organism}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('search')}
              className="px-3.5 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              title="Search and switch to a different biological sequence"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF72]" />
              <span>Switch Sequence</span>
            </button>

            <button
              onClick={downloadFasta}
              className="px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download FASTA</span>
            </button>
          </div>
        </div>

        {/* Workspace Tool Navigation Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#E8BFCB]/50 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1 min-w-max pb-1">
            {visibleTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = effectiveTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setAnalysisWorkspaceSubTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs transition cursor-pointer font-semibold ${
                    isActive
                      ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
                      : 'text-[#49343D]/70 hover:bg-[#FFF9F7] hover:text-[#49343D]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-[#D4AF72]' : 'text-[#49343D]/50'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dynamic Workspace Content */}
      <div className="transition-opacity duration-150">
        {renderActiveToolContent()}
      </div>
    </div>
  );
};
