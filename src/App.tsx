/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BioProvider, useBio } from './context/BioContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { SearchPage } from './components/pages/SearchPage';
import { AnalysisWorkspacePage } from './components/pages/AnalysisWorkspacePage';
import { DnaAnalysisPage } from './components/pages/DnaAnalysisPage';
import { OrfAnalysisPage } from './components/pages/OrfAnalysisPage';
import { TranslationPage } from './components/pages/TranslationPage';
import { ProteinAnalysisPage } from './components/pages/ProteinAnalysisPage';
import { MotifSearchPage } from './components/pages/MotifSearchPage';
import { AlignmentPage } from './components/pages/AlignmentPage';
import { MutationPage } from './components/pages/MutationPage';
import { VcfPage } from './components/pages/VcfPage';
import { MachineLearningPage } from './components/pages/MachineLearningPage';
import { PopulationMapPage } from './components/pages/PopulationMapPage';
import { VisualizationPage } from './components/pages/VisualizationPage';
import { ReportPage } from './components/pages/ReportPage';
import { ArchitectureDocsPage } from './components/pages/ArchitectureDocsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, currentUser, toast, theme } = useBio();

  // If user is not authenticated, show WelcomeScreen
  if (!currentUser) {
    return <WelcomeScreen />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'analysis-workspace':
      case 'analysis-tools':
        return <AnalysisWorkspacePage />;
      case 'dna-analysis':
        return <DnaAnalysisPage />;
      case 'orf-analysis':
      case 'orf-motif':
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
      case 'architecture-docs':
        return <ArchitectureDocsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'dark-slate':
        return 'bg-slate-900 text-slate-100';
      case 'science-blue':
        return 'bg-slate-50 text-slate-900';
      case 'warm-ivory':
      case 'blush-gold':
      default:
        return 'bg-[#FFF9F7] text-[#49343D]';
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans ${getThemeClass()}`}>
      {/* Scrollable Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FFF9F7]">
        <Navbar />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-[#E8BFCB] scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-white border-[#E8BFCB] text-[#49343D]'
                : toast.type === 'error'
                ? 'bg-[#F8E1E7] border-rose-400 text-rose-900'
                : 'bg-white border-[#D4AF72] text-[#49343D]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#D4AF72] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#D4AF72] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BioProvider>
      <DashboardContent />
    </BioProvider>
  );
}
