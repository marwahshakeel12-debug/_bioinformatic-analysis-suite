import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import { downloadVcfFile } from '../../utils/vcfBuilder';
import {
  FileCode2,
  Download,
  Copy,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Info,
} from 'lucide-react';

export const VcfPage: React.FC = () => {
  const {
    activeSequence,
    mutationVariants,
    vcfContent,
    generateVcf,
    setActiveTab,
    showToast,
  } = useBio();

  const [selectedChrom, setSelectedChrom] = useState('chr17');
  const [genomeBuild, setGenomeBuild] = useState('GRCh38 / hg38');

  const handleGenerate = () => {
    generateVcf(selectedChrom);
  };

  const handleDownload = () => {
    if (!vcfContent) {
      showToast('Please generate the VCF file first.', 'error');
      return;
    }
    downloadVcfFile(vcfContent, `${activeSequence?.name || 'variants'}_${selectedChrom}.vcf`);
  };

  const copyVcf = () => {
    if (!vcfContent) return;
    navigator.clipboard.writeText(vcfContent);
    showToast('VCF text copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileCode2 className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base font-bold text-[#49343D]">
              VCF Generator (Variant Call Format v4.2)
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Formats detected nucleotide substitutions and indels into standard VCF v4.2 records.
            Features specification-compliant metadata headers (<span className="font-mono">##INFO, ##FORMAT, ##FILTER</span>) suitable for downstream genomic pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={copyVcf}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] text-[#49343D] text-xs font-semibold rounded-xl transition"
          >
            <Copy className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>Copy VCF</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .vcf</span>
          </button>
        </div>
      </div>

      {/* Configuration Controls Bar */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8BFCB]/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
            VCF Header Metadata Parameters
          </h3>
          <span className="text-xs text-[#49343D]/60 font-mono">
            {mutationVariants.length} variants available for conversion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl space-y-1">
            <label className="text-[11px] font-bold text-[#49343D]/70 uppercase tracking-wider">
              Target Chromosome
            </label>
            <select
              value={selectedChrom}
              onChange={e => setSelectedChrom(e.target.value)}
              className="w-full bg-white border border-[#E8BFCB] text-[#49343D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="chr17">chr17 (BRCA1 locus)</option>
              <option value="chr7">chr7 (EGFR locus)</option>
              <option value="chr11">chr11 (HBB locus)</option>
              <option value="chr17_p53">chr17 (TP53 locus)</option>
              <option value="chr1">chr1</option>
              <option value="chrX">chrX</option>
              <option value="chrM">chrM (Mitochondrial)</option>
            </select>
          </div>

          <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl space-y-1">
            <label className="text-[11px] font-bold text-[#49343D]/70 uppercase tracking-wider">
              Reference Genome Build
            </label>
            <select
              value={genomeBuild}
              onChange={e => setGenomeBuild(e.target.value)}
              className="w-full bg-white border border-[#E8BFCB] text-[#49343D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="GRCh38 / hg38">GRCh38 (Genome Reference Consortium Human Build 38)</option>
              <option value="GRCh37 / hg19">GRCh37 (hg19)</option>
              <option value="T2T-CHM13">T2T-CHM13 v2.0</option>
            </select>
          </div>

          <div className="p-3 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#49343D]/70 uppercase tracking-wider">
                Generate / Refresh
              </div>
              <div className="text-[11px] text-[#49343D]/60 mt-0.5">
                Rebuild with current variants
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="px-3.5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Rebuild VCF
            </button>
          </div>
        </div>
      </div>

      {/* VCF File Content Display */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8BFCB]/50">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-[#D4AF72]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
              Generated VCFv4.2 File Content
            </h3>
          </div>
          <span className="text-xs text-[#49343D]/60 font-mono">
            Standard 8-column tabular format
          </span>
        </div>

        <div className="p-4 bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl font-mono text-xs text-[#49343D] leading-relaxed break-all max-h-80 overflow-y-auto whitespace-pre-wrap">
          {vcfContent || '# Click "Rebuild VCF" to compile variant records into VCFv4.2 format.'}
        </div>
      </div>

      {/* Limitations & Technical Specifications Note */}
      <div className="bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl p-4 text-xs text-[#49343D]/80 flex items-start space-x-3">
        <Info className="w-4 h-4 text-[#D4AF72] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-[#49343D]">Format Specifications & Coordinate Limitations:</div>
          <p className="leading-relaxed">
            VCF coordinates are 1-based according to the official GA4GH VCF v4.2 specification. 
            Variant calls are positioned relative to the target sequence reference transcript. 
            When integrating with whole-genome BAM/CRAM alignments, ensure reference contig headers match your FASTA assembly index.
          </p>
        </div>
      </div>
    </div>
  );
};
