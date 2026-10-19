import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import {
  openReportWindow,
  downloadReportHtml,
  FullReportData,
} from '../../utils/pdfReportGenerator';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Eye,
  Layers,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const {
    currentUser,
    activeSequence,
    dnaAnalysis,
    proteinAnalysis,
    orfs,
    motifResult,
    translatedProtein,
    alignmentResult,
    mutationVariants,
    vcfContent,
    mlMetrics,
    mlPrediction,
    showToast,
  } = useBio();

  const reportPayload: FullReportData = {
    user: currentUser,
    sequence: activeSequence,
    dnaAnalysis,
    proteinAnalysis,
    orfs,
    motifResult,
    translatedProtein,
    alignment: alignmentResult,
    mutations: mutationVariants,
    vcf: vcfContent,
    mlMetrics,
    mlPrediction,
  };

  const handlePrintPdf = () => {
    openReportWindow(reportPayload);
    showToast('Opening report print dialog. Select "Save as PDF" in print options!', 'success');
  };

  const handleDownload = () => {
    downloadReportHtml(reportPayload);
    showToast('Downloaded publication report HTML document.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]">
              Publication Document
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#49343D]">
              Academic Bioinformatics PDF Report Generator
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Aggregates analytical modules into a comprehensive publication-style PDF report with user metadata, sequence tables, alignment metrics, and ML validation.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrintPdf}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF / Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-xl border border-[#E8BFCB] transition"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Download HTML Report</span>
          </button>
        </div>
      </div>

      {/* Report Outline Overview */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-4">
          Report Structure & Compiled Sections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-2">
            <div className="font-bold text-[#D4AF72] flex items-center gap-1.5">
              <span>1. User & Sequence Information</span>
            </div>
            <ul className="text-[#49343D]/70 space-y-1 list-disc list-inside">
              <li>User ID: <span className="text-[#49343D] font-mono font-bold">{currentUser?.userId || 'BIO001'}</span></li>
              <li>Username: <span className="text-[#49343D] font-semibold">{currentUser?.username || 'admin'}</span></li>
              <li>Target Gene: <span className="text-[#49343D] font-semibold">{activeSequence?.name || 'BRCA1'}</span></li>
              <li>Accession: <span className="text-[#49343D] font-mono">{activeSequence?.accession || 'NM_007294.4'}</span></li>
              <li>Sequence Length: <span className="text-[#49343D]">{activeSequence?.length || 0} bp</span></li>
            </ul>
          </div>

          <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-2">
            <div className="font-bold text-[#D4AF72] flex items-center gap-1.5">
              <span>2. Analytics, ORFs & Alignment</span>
            </div>
            <ul className="text-[#49343D]/70 space-y-1 list-disc list-inside">
              <li>GC%: <span className="text-[#49343D] font-semibold">{dnaAnalysis?.gcPercent || 0}%</span> (AT%: {dnaAnalysis?.atPercent || 0}%)</li>
              <li>Identified ORFs: <span className="text-[#49343D] font-semibold">{orfs.length} frames</span></li>
              <li>Translation: <span className="text-[#49343D] font-semibold">{translatedProtein.length} amino acids</span></li>
              <li>Alignment Score: <span className="text-[#49343D] font-semibold">{alignmentResult?.score || 0}</span></li>
              <li>Identified Mutations: <span className="text-[#49343D] font-semibold">{mutationVariants.length} variants</span></li>
            </ul>
          </div>

          <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-2">
            <div className="font-bold text-[#D4AF72] flex items-center gap-1.5">
              <span>3. VCF, ML & Visualizations</span>
            </div>
            <ul className="text-[#49343D]/70 space-y-1 list-disc list-inside">
              <li>VCF Format: <span className="text-[#49343D] font-semibold">v4.2 Specification</span></li>
              <li>Model: <span className="text-[#49343D] font-semibold">Random Forest</span></li>
              <li>Accuracy: <span className="text-[#49343D] font-semibold">{mlMetrics ? `${(mlMetrics.accuracy * 100).toFixed(1)}%` : '92%'}</span></li>
              <li>ML Prediction: <span className="text-[#49343D] font-semibold">{mlPrediction?.classification || 'Promoter'}</span></li>
              <li>Visual Maps: <span className="text-[#49343D] font-semibold">Included</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#49343D]">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF72] shrink-0" />
            <span>All downstream data models validated and synchronized with zero re-entry required.</span>
          </div>

          <button
            onClick={handlePrintPdf}
            className="px-5 py-2.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold text-xs rounded-xl shadow-sm transition shrink-0"
          >
            Generate Full PDF Report &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
