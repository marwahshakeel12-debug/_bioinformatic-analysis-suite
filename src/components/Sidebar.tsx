import React, { useState } from 'react';
import { useBio } from '../context/BioContext';
import { DashboardTab } from '../types/bio';
import {
  Home,
  Search,
  Dna,
  Binary,
  Microscope,
  ArrowRightLeft,
  GitCompare,
  GitBranch,
  FileCode2,
  BrainCircuit,
  Globe,
  BarChart3,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    activeSequence,
    sidebarCollapsed,
    toggleSidebar,
    analysisWorkspaceSubTab,
    setAnalysisWorkspaceSubTab,
  } = useBio();

  const [analysisToolsOpen, setAnalysisToolsOpen] = useState(true);
  const [settingsDocsOpen, setSettingsDocsOpen] = useState(false);

  const isAnalysisTabActive =
    activeTab === 'analysis-workspace' ||
    activeTab === 'analysis-tools' ||
    activeTab === 'dna-analysis' ||
    activeTab === 'orf-analysis' ||
    activeTab === 'translation' ||
    activeTab === 'protein-analysis' ||
    activeTab === 'motif-search' ||
    activeTab === 'alignment' ||
    activeTab === 'mutation' ||
    activeTab === 'population-map';

  const isSettingsDocsActive =
    activeTab === 'settings' || activeTab === 'architecture-docs';

  const navigateToAnalysisTool = (subTabId: string, directTab?: DashboardTab) => {
    setAnalysisWorkspaceSubTab(subTabId);
    if (directTab) {
      setActiveTab(directTab);
    } else {
      setActiveTab('analysis-workspace');
    }
  };

  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } bg-[#FFF9F7] border-r border-[#E8BFCB] flex flex-col h-screen select-none shrink-0 text-[#49343D] transition-all duration-200 z-30`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-[#E8BFCB] flex items-center justify-between bg-white">
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2.5 overflow-hidden cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F8E1E7] border border-[#E8BFCB] flex items-center justify-center text-[#D4AF72] shrink-0 shadow-2xs">
            <Dna className="w-5 h-5 text-[#D4AF72]" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#49343D] tracking-tight leading-tight truncate">
                Bioinformatics
              </h2>
              <p className="text-[10px] text-[#49343D]/70 truncate font-semibold">
                Suite (BAS)
              </p>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-lg bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] flex items-center justify-center text-[#49343D] transition cursor-pointer"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-[#D4AF72]" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-[#D4AF72]" />
          )}
        </button>
      </div>

      {/* User Information Strip */}
      {!sidebarCollapsed ? (
        <div className="p-2.5 mx-2.5 mt-2.5 bg-white rounded-xl border border-[#E8BFCB] shadow-2xs flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F8E1E7] border border-[#E8BFCB] flex items-center justify-center text-[#49343D] font-mono font-bold text-[11px] shrink-0">
            {currentUser?.userId ? currentUser.userId.slice(-3) : '001'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#49343D] truncate">
                {currentUser?.username || 'User'}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#D4AF72]">
                {currentUser?.userId || 'BIO001'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-2 flex justify-center">
          <div
            className="w-8 h-8 rounded-lg bg-white border border-[#E8BFCB] flex items-center justify-center text-[#D4AF72] font-mono text-[10px] font-bold shadow-2xs"
            title={`${currentUser?.username || 'User'} (${currentUser?.userId || 'BIO001'})`}
          >
            {currentUser?.userId ? currentUser.userId.slice(-2) : '01'}
          </div>
        </div>
      )}

      {/* Active Sequence Indicator */}
      {!sidebarCollapsed && activeSequence && (
        <div className="px-2.5 pt-2 pb-1">
          <div
            onClick={() => setActiveTab('analysis-workspace')}
            className="px-2.5 py-1.5 bg-white hover:bg-[#F8E1E7]/50 rounded-xl border border-[#E8BFCB] text-[11px] flex items-center justify-between shadow-2xs cursor-pointer transition group"
            title="Click to view in Analysis Workspace"
          >
            <div className="flex items-center space-x-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-[#49343D] font-semibold truncate group-hover:text-[#D4AF72]">
                {activeSequence.name}
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F8E1E7] text-[#49343D] rounded border border-[#E8BFCB] font-bold shrink-0">
              {activeSequence.type}
            </span>
          </div>
        </div>
      )}

      {/* Main 8 Items Navigation Menu */}
      <nav
        aria-label="Navigation"
        className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-[#E8BFCB] scrollbar-track-transparent"
      >
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
          } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
            activeTab === 'home'
              ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
              : 'text-[#49343D] hover:bg-white'
          }`}
          title="1. Home"
        >
          <Home
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'home' ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
            }`}
          />
          {!sidebarCollapsed && <span className="truncate">1. Home</span>}
        </button>

        {/* 2. Search */}
        <button
          onClick={() => setActiveTab('search')}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
          } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
            activeTab === 'search'
              ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
              : 'text-[#49343D] hover:bg-white'
          }`}
          title="2. Search"
        >
          <Search
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'search' ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
            }`}
          />
          {!sidebarCollapsed && <span className="truncate">2. Search</span>}
        </button>

        {/* 3. Analysis Tools (Grouped Hierarchical Item) */}
        <div>
          <div
            className={`w-full flex items-center justify-between ${
              sidebarCollapsed ? 'justify-center px-2' : 'px-3'
            } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
              isAnalysisTabActive
                ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
                : 'text-[#49343D] hover:bg-white'
            }`}
            onClick={() => {
              if (sidebarCollapsed) {
                setActiveTab('analysis-workspace');
              } else {
                setActiveTab('analysis-workspace');
                setAnalysisToolsOpen(prev => !prev);
              }
            }}
            title="3. Analysis Tools"
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Layers
                className={`w-4 h-4 shrink-0 ${
                  isAnalysisTabActive ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
                }`}
              />
              {!sidebarCollapsed && (
                <span className="truncate">3. Analysis Tools</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <span
                onClick={e => {
                  e.stopPropagation();
                  setAnalysisToolsOpen(prev => !prev);
                }}
                className="text-[#49343D]/50 hover:text-[#49343D] p-0.5"
              >
                {analysisToolsOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>

          {/* Submenu for Analysis Tools */}
          {!sidebarCollapsed && analysisToolsOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-[#E8BFCB]/60 ml-4 my-1">
              <button
                onClick={() => navigateToAnalysisTool('overview', 'analysis-workspace')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'overview'
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Layers className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">All Tools Workspace</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('dna-analysis', 'dna-analysis')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'dna-analysis' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'dna-analysis')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Dna className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">DNA Analysis</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('orf-analysis', 'orf-analysis')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'orf-analysis' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'orf-analysis')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Microscope className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">ORF Analysis</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('translation', 'translation')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'translation' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'translation')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <ArrowRightLeft className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">DNA-to-Protein</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('protein-analysis', 'protein-analysis')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'protein-analysis' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'protein-analysis')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Binary className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Protein Analysis</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('motif-search', 'motif-search')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'motif-search' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'motif-search')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Search className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Motif Search</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('alignment', 'alignment')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'alignment' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'alignment')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <GitCompare className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Sequence Alignment</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('mutation', 'mutation')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'mutation' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'mutation')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <GitBranch className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Mutation Analysis</span>
              </button>

              <button
                onClick={() => navigateToAnalysisTool('population-map', 'population-map')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'population-map' || (activeTab === 'analysis-workspace' && analysisWorkspaceSubTab === 'population-map')
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Globe className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Population Map</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. VCF Generator */}
        <button
          onClick={() => setActiveTab('vcf')}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
          } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
            activeTab === 'vcf'
              ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
              : 'text-[#49343D] hover:bg-white'
          }`}
          title="4. VCF Generator"
        >
          <FileCode2
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'vcf' ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
            }`}
          />
          {!sidebarCollapsed && <span className="truncate">4. VCF Generator</span>}
        </button>

        {/* 5. Machine Learning */}
        <button
          onClick={() => setActiveTab('machine-learning')}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
          } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
            activeTab === 'machine-learning'
              ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
              : 'text-[#49343D] hover:bg-white'
          }`}
          title="5. Machine Learning"
        >
          <BrainCircuit
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'machine-learning' ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
            }`}
          />
          {!sidebarCollapsed && (
            <span className="truncate">5. Machine Learning</span>
          )}
        </button>

        {/* 6. Visualization */}
        <button
          onClick={() => setActiveTab('visualization')}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
          } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
            activeTab === 'visualization'
              ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
              : 'text-[#49343D] hover:bg-white'
          }`}
          title="6. Visualization"
        >
          <BarChart3
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'visualization' ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
            }`}
          />
          {!sidebarCollapsed && <span className="truncate">6. Visualization</span>}
        </button>

        {/* 7. Reports */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
          } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
            activeTab === 'reports'
              ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
              : 'text-[#49343D] hover:bg-white'
          }`}
          title="7. Reports"
        >
          <FileText
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'reports' ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
            }`}
          />
          {!sidebarCollapsed && <span className="truncate">7. Reports</span>}
        </button>

        {/* 8. Settings & Documentation */}
        <div>
          <div
            className={`w-full flex items-center justify-between ${
              sidebarCollapsed ? 'justify-center px-2' : 'px-3'
            } py-2 rounded-xl text-xs transition cursor-pointer text-left ${
              isSettingsDocsActive
                ? 'bg-[#F8E1E7] text-[#49343D] font-bold border border-[#E8BFCB] shadow-2xs'
                : 'text-[#49343D] hover:bg-white'
            }`}
            onClick={() => {
              if (sidebarCollapsed) {
                setActiveTab('settings');
              } else {
                setActiveTab('settings');
                setSettingsDocsOpen(prev => !prev);
              }
            }}
            title="8. Settings & Documentation"
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Settings
                className={`w-4 h-4 shrink-0 ${
                  isSettingsDocsActive ? 'text-[#D4AF72]' : 'text-[#49343D]/60'
                }`}
              />
              {!sidebarCollapsed && (
                <span className="truncate">8. Settings & Documentation</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <span
                onClick={e => {
                  e.stopPropagation();
                  setSettingsDocsOpen(prev => !prev);
                }}
                className="text-[#49343D]/50 hover:text-[#49343D] p-0.5"
              >
                {settingsDocsOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>

          {!sidebarCollapsed && settingsDocsOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-[#E8BFCB]/60 ml-4 my-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'settings'
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <Settings className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Platform Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture-docs')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer ${
                  activeTab === 'architecture-docs'
                    ? 'font-bold text-[#D4AF72] bg-white'
                    : 'text-[#49343D]/80 hover:text-[#49343D] hover:bg-white'
                }`}
              >
                <BookOpen className="w-3 h-3 text-[#D4AF72]" />
                <span className="truncate">Architecture Docs</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Action */}
      <div className="p-2.5 border-t border-[#E8BFCB] bg-white">
        <button
          onClick={logout}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-1' : 'justify-center space-x-2 px-3'
          } py-2 text-xs font-semibold text-[#49343D] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-xl transition shadow-2xs cursor-pointer`}
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5 text-[#D4AF72]" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
